import React, { useState } from "react";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

function ReactPDF() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(3);
  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Document
        file="http://localhost:3000/api/gv/strategy/v1/material/preview?key=bbd035587ab741b5ac507a595d69b8bc"
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        {/* {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))} */}
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}

export default ReactPDF;
