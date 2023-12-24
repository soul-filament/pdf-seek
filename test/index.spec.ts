import { PDFSeaker } from '../src';
import fs from 'fs';
import { readRow } from '../src/do_readDataRow';

describe('ability to seek and read from docuemnt', () => {
  it('should be able to read from file', async () => {
    const pdfSeaker = await PDFSeaker.fromFile('./test/test_pdfs/doc1.pdf');

    const a = pdfSeaker
      .joinDataByValue()
      .jumpToString('117th Congress:')
      .step();

    expect(a.read()).toEqual('Search ');

    const b = a.jumpToString('Bill Status Table').step();

    expect(b.read()).toEqual(
      'Table A-1 was created by using Congress.gov’s “Status of Legislation” filter in each set of search'
    );
  });

  it('should be able to read from raw data', async () => {
    const pdfSeaker = await PDFSeaker.fromFile('./test/test_pdfs/doc2.pdf');

    const a = pdfSeaker.jumpToString('CONSOLIDATED').step();

    expect(a.readNonEmpty()).toEqual(
      '(In millions, except number of shares, which are reflected in thousands, and per'
    );

    const b = a.jumpToString('Operating income ');

    expect(b.readRow()).toEqual(['26,969', '24,894', '114,301', '119,437']);
  });
});
