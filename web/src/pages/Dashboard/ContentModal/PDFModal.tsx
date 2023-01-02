import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileRef } from "../../../types/Files";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PDFModalProps = {
  bytes: ArrayBuffer;
  file: FileRef;
};

const PDFModal: React.FC<PDFModalProps> = ({ file, bytes }) => {
  return (
    <Document file={bytes}>
      <Page
        pageNumber={1}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
};

export default PDFModal;
