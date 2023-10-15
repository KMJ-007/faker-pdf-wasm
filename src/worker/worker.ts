/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { run } from 'wasm-pdf'

export const runPdfLogic = (data:any) => {
  // @ts-ignore
  self.pdfFileBlobURL = null;
  // @ts-ignore
  self.generatePDF = (data: any) => {
    const blob = new Blob([data], {
      type: 'application/pdf'
    });
    // @ts-ignore
    if (self.pdfFileBlobURL !== null) {
      // @ts-ignore
      URL.revokeObjectURL(self.pdfFileBlobURL);
    }
    // @ts-ignore
    self.pdfFileBlobURL = URL.createObjectURL(blob);
    // for debugging purposes, open another window
    // @ts-ignore
    // self.open(self.pdfFileBlobURL, "_blank");
    // @ts-ignore
    // self.location.href = self.pdfFileBlobURL;
    console.log(self.pdfFileBlobURL)
  }
  run(data);
  // @ts-ignore
  return self.pdfFileBlobURL;
}