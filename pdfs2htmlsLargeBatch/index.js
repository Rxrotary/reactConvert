const pdf2html = require('pdf2html');
const fs = require('fs');
const path = require('path');

const pdfSourceFolder = './in/';
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
          let newFileName = file.trim().replace(/\s+|[-]/g, '_');
          fs.rename(
            path.join(sourceFolder, file),
            path.join(sourceFolder, newFileName),
            (err) => {
              if (err) {
                console.log('ERROR: ' + err);
              }
            }
          );
          fileNames.push(newFileName);
        }
      });
      return resolve(fileNames);
    });
  });
};

const pdfToHtml = (file, sourceFolder, outputFolder) => {
  return new Promise((resolve, reject) => {
    pdf2html.html(path.join(sourceFolder, file), (err, html) => {
      if (err) {
        console.error('Conversion error: ' + err);
      } else {
        fs.writeFile(
          `${outputFolder}/${file.replace(/\.pdf$/, '')}.html`,
          html,
          (err) => {
            if (err) {
              throw err;
            }
            return resolve(console.log(`${file} has been saved!`));
          }
        );
      }
    });
  });
};

const pdfToHtmls = async (sourceFoler, outputFolder) => {
  pdfFiles = await getPdfFiles(sourceFoler);
  let fileCont = pdfFiles.length - 1;
  while (fileCont) {
    await pdfToHtml(pdfFiles[fileCont], sourceFoler, outputFolder);
    fileCont--;
  }
};

pdfToHtmls(pdfSourceFolder, htmlOutputFolder);
