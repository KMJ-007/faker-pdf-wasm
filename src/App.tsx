import './App.css'
import { run } from 'wasm-pdf'
import pdfDataJson from "../template.json"
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { format, isValid } from 'date-fns';

function App() {
  const [inputNumber, setInputNumber] = useState(0);
  const [pdfData, setPdfData] = useState(pdfDataJson);
  const [timeTaken, setTimeTaken] = useState<number|null>(null)
  const fakerLogic = () => {
    const updatedPdfData = { ...pdfData };

    for (let i = 0; i < inputNumber; i++) {
      const fakeRow:any = {
        "Inv-Dt.": fddmmyy(faker.date.anytime().toString()),
        "pcs": faker.number.int({ min: 1000, max: 100000 }),
        "Inv.Amt": faker.number.int({ min: 1000, max: 100000 }),
        "Transport": faker.company.name(),
        "LR.No": faker.number.int({ min: 0, max: 100 }),
        "LR.Date": fddmmyy(faker.date.anytime().toString())
      };

      // Add each fakeRow to the PDF template
      if (updatedPdfData.contents && updatedPdfData.contents.length > 0) {
        // check if header row exist
        if(updatedPdfData.contents[0].params.rows.length > 0) {
          updatedPdfData.contents[0].params.rows.push({
            "obj_type": "Row",
            "params": {
              cells: Object.keys(fakeRow).map((cellKey)=>({
                "obj_type": "Cell",
                "params": {
                  "style": {
                      "background_color": [0.9, 0.9, 0.95]
                  },
                  "contents": [
                      {
                          "obj_type": "Paragraph",
                          "params": {
                              "text": fakeRow[cellKey],
                              "align": "center",
                              "font_name": "Helvetica-Bold"
                          }
                      }
                  ]
                }
              }))
            }
          })
        } 
      }

    }
    console.log(updatedPdfData)
    setPdfData(updatedPdfData);
  }

  const wasmPdfLogic = () => {
    // @ts-ignore
    window.pdfFileBlobURL = null;
    // @ts-ignore
    window.generatePDF = (data: any) => {
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
      // @ts-ignore
      window.open(window.pdfFileBlobURL, "_blank");
      // @ts-ignore
      // window.location.href = window.pdfFileBlobURL;
    }
    console.log(window)
    run(pdfData)
  }

  const createPdf = () => {
    setTimeTaken(null);
    let start = Date.now();
    // Faker logic:
    fakerLogic();
    wasmPdfLogic();
    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");
    setTimeTaken(timeTaken);
  }

  return (
    <>
      <h1>Hello Karan</h1>
      <h3>Time Taken {timeTaken||"-"} milliseconds</h3>
      <div className="card">
        <input
          type="number"
          className="input"
          value={inputNumber}
          onChange={(e) => setInputNumber(parseInt(e.target.value) || 0)}
        />
        <button onClick={createPdf}>
          Create Pdf
        </button>
      </div>
    </>
  )
}

export default App

function fddmmyy(date: any) {
  // console.log({date});
  return date && isValid(new Date(date)||date) ? format(new Date(date), 'dd-MM-yy') : "";
}