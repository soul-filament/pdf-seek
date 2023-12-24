# PDF Seek

> Simple PDF data extraction package to provide a few useful wrappers around existing PDF parsers for JS

## Getting started

Install from NPM:

```
npm install pdf-seek
```

## Usage

```ts
import { PDFSeek } from 'pdf-seek';

// Load in a pdf file
const pdfSeaker = await PDFSeaker.fromFile('./my.pdf');

// Do operations on it using API
const text = pdfSeaker
    .jumpToString('my string')
    .step()
    .step()
    .read()

// Profit?
```


## API

The seaker automatically breaks the PDF down into a stream of elements, which can be navigated using the API. Depending on how the PDF was constructed, an elements can be a single character, a word, a line, or a paragraph.

To help with navigation in the case where the PDF has small elements, the seaker has an option for `joinDataByValue`, which will join elements together if they have the same y value on the page and occur sequentially. This is useful for PDFs where each character is a separate element.

Internally, the pdf-seeker object has a pointer to the current element, which is updated by the API methods. The pointer is initially set to the first element in the PDF.

### step

- Moves the current position in the PDF by a single element.

### stepBack

- Moves the current position in the PDF back by a single element.

### read

- Returns the current element as a string.

### readNotEmpty

- If the current element is empty, moves the pointer forward until it finds a non-empty element, then returns that element as a string.

### readContent

- Returns the current element as an object with X, Y, and Value properties.

### isComplete

- Returns true if the current position in the PDF is at the end of the PDF.

### readMany

- Returns an array of elements, starting from the current position in the PDF, and moving forward by the specified number of elements.

### jumpToString

- Moves the current position in the PDF to the first element that matches the specified string. If the string is not found, throws an error

### readTillString

- Returns an array of elements, starting from the current position in the PDF, and moving forward until the specified string is found. If the string is not found, throws an error

### readRow

- Returns an array of elements, starting from the current position in the PDF, and moving forward until the end of the row is found. The end of the row is determined when there are no longer any elemeents of the same height within a certain index count ahead of it. The distance can be specified as an option when creating the PDFSeeker object.

### readAllRows

- Returns an array of arrays of elements, where each array is a row of elements. The rows are determined by the same method as `readRow`.

### readAllRowsUntil

- Returns an array of arrays of elements, where each array is a row of elements. The rows are determined by the same method as `readRow`, but the process stops when the specified string is found.

### joinDataByValue

- Joins elements together if they have the same y value on the page and occur sequentially. This is useful for PDFs where each character is a separate element.