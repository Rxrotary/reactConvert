const PDFParser = require("pdf2json");
const fs = require("fs");
const fileNames = [];
const pdfSourceFolder = "./in1/";
const jsonOutputFolder = "./out/";
const async = require("async");
let fileCont = 0;

function readOneFile(path, cb) {
  console.log(path);
  let pdfParser = new PDFParser();
  pdfParser.on("pdfParser_dataError", (errData) => {
    cb(errData);
  });
  pdfParser.on("pdfParser_dataReady", (pdfData) => {
    fs.writeFile(
      `${jsonOutputFolder}/${fileCont}.json`,
      JSON.stringify(pdfData),
      (err) => {}
    );
    fileCont++;
    cb(null);
  });
  console.log(`${pdfSourceFolder}${path}`);
  pdfParser.loadPDF(`${pdfSourceFolder}${path}`);
}

fs.readdir(pdfSourceFolder, function(err, files) {
  console.log(files);
  for (var i = files.length - 1; i >= 0; i--) {
    if (files[i].indexOf(".pdf") !== -1) {
      fileNames.push(files[i]);
    }
  }

  async.eachSeries(files, readOneFile, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

// const PDFParser = require("pdf2json");
// const fs = require("fs");
// const fileNames = [];
// const pdfSourceFolder = "./in1/";
// const jsonOutputFolder = "./out/";

// fs.readdir(pdfSourceFolder, function(err, files) {
//   console.log(files);
//   for (var i = files.length - 1; i >= 0; i--) {
//     if (files[i].indexOf(".pdf") !== -1) {
//       fileNames.push(files[i]);
//     }
//   }
//   let pdfParser = null;
//   for (let fileCont = 0; fileCont < fileNames.length; fileCont++) {

//     pdfParser = new PDFParser();

//     pdfParser.on("pdfParser_dataError", (errData) =>
//       console.error(errData.parserError)
//     );
//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       fs.writeFileSync(
//         `${jsonOutputFolder}/${fileNames[fileCont]}.json`,
//         JSON.stringify(pdfParser.getRawTextContentStream())
//       );
//       // fs.writeFile(`${jsonOutputFolder}/${fileNames[fileCont]}.json`, pdfData,(err) => {
//       // })
//     });

//     pdfParser.loadPDF(`./${pdfSourceFolder}/${fileNames[fileCont]}`);
//   }
// });

// let fs = require('fs')

// var PDFParser = require("./node_modules/pdf2json");
// var pdfParser = new PDFParser(this,1);

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
// pdfParser.on("pdfParser_dataReady", pdfData => {
//     console.log(pdfParser)
//     fs.writeFileSync("./textapi/output", JSON.stringify(pdfParser.getRawTextContentStream()));
// });

// pdfParser.loadPDF("./textapi/uploads");
