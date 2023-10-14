import './App.css'
import  { run } from 'wasm-pdf'
import pdfDataJson from "../template.json"

function App() {


  const createPdf = () => {
    // @ts-ignore
    window.pdfFileBlobURL = null;
    // @ts-ignore
    window.generatePDF = (data:any) => {
      const blob = new Blob([data], {
        type: 'application/pdf'
      });
      // @ts-ignore
      if (window.pdfFileBlobURL !== null) {
        // @ts-ignore
        URL.revokeObjectURL(window.pdfFileBlobURL);
      }
      // @ts-ignore
      window.pdfFileBlobURL = URL.createObjectURL(blob);
      // for debugging purposes, open another window
      //window.open(pdfFileBlobURL, "_blank");
      // @ts-ignore
      window.location.href = window.pdfFileBlobURL;
    }
    console.log(window)
    const pdfData = run(pdfDataJson)
    

    
    console.log(pdfData)
  } 
  return (
    <>
      <h1>Hello Karan</h1>
      <div className="card">
        <button onClick={createPdf}>
          Create Pdf
        </button>
      </div>
    </>
  )
}

export default App
