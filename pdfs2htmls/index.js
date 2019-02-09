const pdf2html = require('pdf2html');
const fs = require('fs');

// Conversion error: Error: Command failed: java -jar ...
//will occur if the source folder is not './'
const pdfSourceFolder = './';
const htmlOutputFolder = './out/';

const getPdfFiles = (sourceFolder) => {
  const fileNames = [];
  return new Promise((resolve, reject) => {
    fs.readdir(sourceFolder, async (err, files) => {
      if (err) {
        return reject('error occured when getting pdf files');
      }
      files.map((file) => {
        if (file.indexOf('.pdf') !== -1) {
          fileNames.push(file);
        }
      });
      return resolve(fileNames);
    });
  });
};

const pdfToHtml = (file, outputFolder) => {
  pdf2html.html(file, (err, html) => {
    if (err) {
      console.error('Conversion error: ' + err);
    } else {
      fs.writeFile(
        `${outputFolder}/${file.replace(/\.pdf$/, '')}.html`,
        html,
        (err) => {
          if (err) throw err;
          console.log(`${file} has been saved!`);
        }
      );
    }
  });
};

const pdfToHtmls = async (sourceFoler, outputFolder) => {
  pdfFiles = await getPdfFiles(sourceFoler);
  pdfFiles.map((file) => {
    pdfToHtml(file, outputFolder);
  });
};

pdfToHtmls(pdfSourceFolder, htmlOutputFolder);
