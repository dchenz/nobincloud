import { ButtonGroup, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "react-bootstrap-icons";
import { Document, Page, pdfjs } from "react-pdf";
import { FileRef } from "../../../types/Files";
import "./styles.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PDFModalProps = {
  bytes: ArrayBuffer;
  file: FileRef;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;

const PDFModal: React.FC<PDFModalProps> = ({ bytes }) => {
  const [zoom, setZoom] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <React.Fragment>
      <Document
        file={bytes}
        onLoadSuccess={(doc) => setTotalPages(doc.numPages)}
      >
        <Page
          className="react-pdf-page"
          pageNumber={pageNumber}
          scale={zoom}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      <ButtonGroup position="absolute" top="20px">
        <IconButton
          icon={<ZoomOut />}
          aria-label="zoom-out"
          onClick={() => setZoom(Math.max(zoom - 0.25, MIN_ZOOM))}
          disabled={zoom === MIN_ZOOM}
        />
        <IconButton
          icon={<ZoomIn />}
          aria-label="zoom-in"
          onClick={() => setZoom(Math.min(zoom + 0.25, MAX_ZOOM))}
          disabled={zoom === MAX_ZOOM}
        />
      </ButtonGroup>
      <ButtonGroup position="absolute" top="70px">
        <IconButton
          icon={<ChevronLeft />}
          aria-label="previous-page"
          onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
          disabled={pageNumber === 1}
        />
        <IconButton
          icon={<ChevronRight />}
          aria-label="next-page"
          onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages))}
          disabled={pageNumber === totalPages}
        />
      </ButtonGroup>
    </React.Fragment>
  );
};

export default PDFModal;
