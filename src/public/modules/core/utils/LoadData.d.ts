/**
 * Type definition for file loading. Covers LoadData.js file
 */

declare function xlsFileReader(file: any, 
  callback: (cols: string[], rows: string[][]) => void); 

declare function pdfFileReader(file: any, 
  callback: (res: ArrayBuffer) => void);

declare function textFileReader(file: any,
  callback: (res: string) => void);

declare function csvFileReader(file: any,
    callback: (res: string) => void);

/**
 * Type definitions for file saving
 */

declare function saveAs(data: Blob, filename: string);