import { PDFExtract, PDFExtractResult } from 'pdf.js-extract';
import { readAllRows, readAllRowsUntil, readRow } from './do_readDataRow';
import { joinDataByValue } from './do_joinByValue';

export class PDFSeaker {
  private static pdfExtract = new PDFExtract();

  // Build new instance from file

  public static async fromFile(filePath: string) {
    const extractionResult = await this.pdfExtract.extract(filePath, {});
    return new PDFSeaker(extractionResult);
  }

  // Build new instance directly

  private pointerPage = 0;
  private pointerData = 0;

  public constructor(private data: PDFExtractResult) {}

  public rawDocument() {
    return this.data;
  }

  // Move Pointers

  public step() {
    this.pointerData++;
    if (this.pointerData >= this.data.pages[this.pointerPage].content.length) {
      this.pointerPage++;
      this.pointerData = 0;
    }
    return this;
  }

  public stepBack() {
    this.pointerData--;
    if (this.pointerData < 0) {
      this.pointerPage--;
      this.pointerData = this.data.pages[this.pointerPage].content.length - 1;
    }
    return this;
  }

  // Read data

  public read() {
    const page = this.data.pages[this.pointerPage];
    const content = page.content[this.pointerData];
    return content.str;
  }

  public readNonEmpty() {
    let data = this.read();
    while (data === '') {
      this.step();
      data = this.read();
    }
    return data;
  }

  public readContent() {
    const page = this.data.pages[this.pointerPage];
    const content = page.content[this.pointerData];
    return content;
  }

  public isComplete() {
    return this.pointerPage >= this.data.pages.length;
  }

  public readMany(count = 10) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(this.read());
      this.step();
    }
    return results;
  }

  // Search for specific data

  public jumpToString(str: string) {
    let runningString = '';
    while (!this.isComplete()) {
      const data = this.read();
      runningString += data;
      if (runningString.includes(str)) {
        return this;
      }
      this.step();
    }
    throw new Error(`String "${str}" not found in remainder of document`);
  }

  public readTillString(str: string) {
    const results = [];
    while (!this.isComplete()) {
      const data = this.read();
      if (data.includes(str)) {
        return results;
      }
      results.push(data);
      this.step();
    }
    throw new Error(`String "${str}" not found in remainder of document`);
  }

  // Expose further functions for reading rows in document tables

  public readRow(lookAhead = 10) {
    return readRow(this, lookAhead);
  }

  public readAllRows() {
    return readAllRows(this);
  }

  public readAllRowsUntil(until: string) {
    return readAllRowsUntil(this, until);
  }

  public joinDataByValue() {
    return joinDataByValue(this);
  }
}
