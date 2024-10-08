// Import the pdfjsLib object from pdf.mjs
import * as pdfjsLib from '../pdfjs-4.7.76-dist/build/pdf.mjs';

// Specify the path to the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '../pdfjs-4.7.76-dist/build/pdf.worker.mjs';

// pdf location 
const url = '../docs/sample-pdf.pdf'

// default values
let pdfDoc = null, // document you get with pdf.js
    pageNum = 1, // page number
    pageIsRendering = false, // sets to true when runderPage() is running
    pageNumIsPending = null; // used when fetching multiple pages

// fetch pdf and put it in canvas
const scale = 1.5, // size
    canvas = document.querySelector('#pdf-render'),
    context = canvas.getContext('2d');

// Render page
const renderPage = num => {

    // starting page rendering
    pageIsRendering = true;

    // get page
    // getPage() returns a promise
    pdfDoc.getPage(num).then(page => {

        console.log(page);

        // set page scale
        const viewport = page.getViewport({ scale });

        // set canvas size
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {

            canvasContext : context, viewport

        }

        page.render(renderContext).promise.then(() => {

            // ending page rendering
            pageIsRendering = false;

            if(pageNumIsPending != null){

                // pass page number
                renderPage(pageNumIsPending);

                pageNumIsPending = null;

            }
        });

        // Output current page
        document.querySelector('#page-num').textContent = num;

    });

}

// Get document
pdfjsLib.getDocument(url).promise.then(pdf_Doc => {

    pdfDoc = pdf_Doc;

    console.log(pdfDoc);

    // Add total page count to pagination
    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    // call renderPage() with intitial page
    renderPage(pageNum)


});



