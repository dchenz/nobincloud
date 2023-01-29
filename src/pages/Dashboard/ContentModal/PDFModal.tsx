import { Box, ButtonGroup, IconButton, Text } from "@chakra-ui/react";
import classNames from "classnames";
import React, { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "react-bootstrap-icons";
import { Document, Page, pdfjs } from "react-pdf";
import { FileRef } from "../../../types/Files";
import "./styles.sass";

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
  const [showControls, setShowControls] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const onDocumentMouseMove = useMemo(() => {
    let timer: NodeJS.Timeout | null = null;
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      setShowControls(true);
      timer = setTimeout(() => {
        if (navRef.current) {
          // HACK: If mouse is hovering over controls, it will
          // have "border-top-style" set to "hidden" in CSS.
          const bt = window
            .getComputedStyle(navRef.current)
            .getPropertyValue("border-top-style");
          if (bt !== "hidden") {
            setShowControls(false);
          }
        }
      }, 3000);
    };
  }, [navRef.current]);

  return (
    <Box onMouseMove={onDocumentMouseMove}>
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
      <Box
        className={classNames({
          "react-pdf-nav-container": true,
          hidden: !showControls,
        })}
        ref={navRef}
      >
        <ButtonGroup className="react-pdf-btn-group">
          <IconButton
            size="sm"
            icon={<ZoomOut />}
            title="Zoom out"
            aria-label="zoom-out"
            onClick={() => setZoom(Math.max(zoom - 0.25, MIN_ZOOM))}
            disabled={!showControls || zoom === MIN_ZOOM}
          />
          <Text>{Math.floor(zoom * 100)}%</Text>
          <IconButton
            size="sm"
            icon={<ZoomIn />}
            title="Zoom in"
            aria-label="zoom-in"
            onClick={() => setZoom(Math.min(zoom + 0.25, MAX_ZOOM))}
            disabled={!showControls || zoom === MAX_ZOOM}
          />
        </ButtonGroup>
        <ButtonGroup className="react-pdf-btn-group">
          <IconButton
            size="sm"
            icon={<ChevronLeft />}
            title="Previous page"
            aria-label="previous-page"
            onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
            disabled={!showControls || pageNumber === 1}
          />
          <Text>
            {pageNumber} / {totalPages}
          </Text>
          <IconButton
            size="sm"
            icon={<ChevronRight />}
            title="Next page"
            aria-label="next-page"
            onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages))}
            disabled={!showControls || pageNumber === totalPages}
          />
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default PDFModal;
