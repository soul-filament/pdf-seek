import { PDFExtractResult, PDFExtractText } from 'pdf.js-extract';
import { PDFSeaker } from '.';

export function joinDataByValue(pdfSeaker: PDFSeaker) {
  const sections: PDFExtractText[] = [];

  const startingData = pdfSeaker.readContent();

  let lastY = startingData.y;
  let lastX = startingData.x + startingData.width;
  let stringSoFar = '';

  while (!pdfSeaker.isComplete()) {
    const content = pdfSeaker.readContent();

    if (
      content.y === lastY &&
      content.x - lastX < 3 &&
      content.x - lastX >= -1
    ) {
      stringSoFar += content.str;
    } else {
      const newData: PDFExtractText = {
        ...content,
        str: stringSoFar,
      };
      stringSoFar = content.str;
      sections.push(newData);
    }

    lastY = content.y;
    lastX = content.x + content.width;

    pdfSeaker.step();
  }

  const simpleData: any = {
    pages: [
      {
        content: sections,
      },
    ],
  };

  return new PDFSeaker(simpleData);
}
