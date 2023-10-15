import './App.css'
import { run } from 'wasm-pdf'
import pdfDataJson from "../template.json"
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { format, isValid } from 'date-fns';
import { workerInstance } from './worker/pdfWorkerLogic';

function App() {
  const [inputNumber, setInputNumber] = useState(0);
  const [pdfData, setPdfData] = useState(pdfDataJson);
  const [timeTaken, setTimeTaken] = useState<number|null>(null)
  const fakerLogic = () => {
    const updatedPdfData = { ...pdfData };

    let start = Date.now();
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
    let timeTaken = Date.now() - start;
    console.log("Total time taken for mapping logic : " + timeTaken + " milliseconds");
    console.log(updatedPdfData)
    setPdfData(updatedPdfData);
  }

  const wasmPdfLogic = async() => {
    
    console.log(window)
    const pdfWebWorker = await workerInstance.runPdfLogic(pdfData);
    window.open(pdfWebWorker, "_blank");
    console.log(pdfWebWorker);
    // run(pdfData)
  }

  const createPdf = async() => {
    setTimeTaken(null);
    setPdfData(pdfDataJson);
    let start = Date.now();
    // Faker logic:
    fakerLogic();
    await wasmPdfLogic();
    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");
    setTimeTaken(timeTaken);
  }

  return (
    <>
      <h1>Hello Karan</h1>
      <h4>Simple POC for creating pdf using WASM in webworker</h4>
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