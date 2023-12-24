import { PDFSeaker } from '.';

export function readRow(pdfSeaker: PDFSeaker, lookAhead = 10) {
  const targetY = pdfSeaker.readContent().y;
  const results: string[] = [];

  while (!pdfSeaker.isComplete()) {
    let valueInForwardWindow = false;
    let seakDistance = 0;

    for (; seakDistance < lookAhead; seakDistance++) {
      pdfSeaker.step();
      if (pdfSeaker.isComplete()) break;

      const data = pdfSeaker.readContent();

      if (data.y == targetY) {
        valueInForwardWindow = true;
        break;
      }
    }

    for (; seakDistance > 0; seakDistance--) {
      pdfSeaker.stepBack();
    }

    const content = pdfSeaker.read();
    if (content.trim().length > 0) {
      results.push(content.trim());
    }
    pdfSeaker.step();

    if (!valueInForwardWindow) {
      break;
    }
  }
  return results;
}

export function readAllRows(pdfSeaker: PDFSeaker) {
  const results: string[][] = [];
  while (!pdfSeaker.isComplete()) {
    results.push(readRow(pdfSeaker));
  }
  return results;
}

export function readAllRowsUntil(pdfSeaker: PDFSeaker, until: string) {
  const results: string[][] = [];
  while (!pdfSeaker.isComplete()) {
    const row = readRow(pdfSeaker);
    results.push(row);
    if (pdfSeaker.read().trim() === until.trim()) {
      break;
    }
  }
  return results;
}
