const PDFParser = require("pdf2json");
const fs = require("fs");
const fileNames = [];
const pdfSourceFolder = "./in/";
const jsonOutputFolder = "./out/";

fs.readdir(pdfSourceFolder, function(err, files) {
  for (var i = files.length - 1; i >= 0; i--) {
    if (files[i].indexOf(".pdf") !== -1) {
      fileNames.push(files[i]);
    }
  }
  for (let fileCont = 0; fileCont < fileNames.length; fileCont++) {
    let pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", (errData) =>
      console.error(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      fs.writeFileSync(
        `${jsonOutputFolder}/${fileNames[fileCont]}.json`,
        JSON.stringify(pdfParser.getRawTextContentStream())
      );
    });

    pdfParser.loadPDF(`./${pdfSourceFolder}/${fileNames[fileCont]}`);
  }
});

// let fs = require('fs')

// var PDFParser = require("./node_modules/pdf2json");
// var pdfParser = new PDFParser(this,1);


// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
// pdfParser.on("pdfParser_dataReady", pdfData => {
//     console.log(pdfParser)
//     fs.writeFileSync("./textapi/output", JSON.stringify(pdfParser.getRawTextContentStream()));
// });

// pdfParser.loadPDF("./textapi/uploads");


// -----------------------------------------------------------------------------------------------------------

// function FileFinder() {
//     var Path, foundFiles, aFile, Path;

//     Path = "C:\\Users\bumseokshim\Documents\textapi\textapi\data"; //Folder where we will search for files
//     foundFiles = aqFileSystem.FindFiles(Path, "*.pdf");

//     if (!strictEqual(foundFiles, null))
//         while (foundFiles.HasNext()) {
//             aFile = foundFiles.Next();
//             Log.Message("Processing the file " + Path + aFile.Name);

//             let fs = require('fs')

//             var PDFParser = require("./node_modules/pdf2json");
//             var pdfParser = new PDFParser(this, 1);

//             pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
//             pdfParser.on("pdfParser_dataReady", pdfData => {
//                 console.log(pdfParser)
//                 fs.writeFileSync('json' + aFile, JSON.stringify(pdfParser.getRawTextContentStream()));
//             });

//             pdfParser.loadPDF(aFile);
//         };
// }


// ---------------------------------------------------------------------------------------------------------------

// let fs = require('fs'),
// 	stream = require('stream'),
// 	nodeUtil = require("util"),
//     _ = require("lodash"),
//     async = require("async"),
// 	PDFJS = require("./lib/pdf.js");

// let PDFParser = (function () {
//     // private static
//     let _nextId = 1;
//     let _name = 'PDFParser';

//     let _binBuffer = {};
//     let _maxBinBufferCount = 10;

// 	//private methods, needs to invoked by [funcName].call(this, ...)
// 	let _onPDFJSParseDataReady = function(data) {
// 		if (!data) { //v1.1.2: data===null means end of parsed data
// 			nodeUtil.p2jinfo("PDF parsing completed.");
// 			let output = {"formImage": this.data};
// 			this.emit("pdfParser_dataReady", output);
// 			if (typeof this.flushCallback === 'function') {
// 				this.push(output);
// 				this.flushCallback();
// 				this.flushCallback = null;
// 			}
// 		}
// 		else {
// 			Object.assign(this.data, data);
// 		}
// 	};

// 	let _onPDFJSParserDataError = function(data) {
// 		this.data = null;
// 		this.emit("pdfParser_dataError", {"parserError": data});
// 	};

// 	let _startParsingPDF = function(buffer) {
// 		this.data = {};

// 		this.PDFJS.on("pdfjs_parseDataReady", _onPDFJSParseDataReady.bind(this));
// 		this.PDFJS.on("pdfjs_parseDataError", _onPDFJSParserDataError.bind(this));

// 		this.PDFJS.parsePDFData(buffer || _binBuffer[this.pdfFilePath]);
// 	};

// 	let _processBinaryCache = function() {
// 		if (_.has(_binBuffer, this.pdfFilePath)) {
// 			_startParsingPDF.call(this);
// 			return true;
// 		}

// 		let allKeys = _.keys(_binBuffer);
// 		if (allKeys.length > _maxBinBufferCount) {
// 			let idx = this.get_id() % _maxBinBufferCount;
// 			let key = allKeys[idx];
// 			_binBuffer[key] = null;
// 			delete _binBuffer[key];

// 			nodeUtil.p2jinfo("re-cycled cache for " + key);
// 		}

// 		return false;
// 	};

// 	let _processPDFContent = function(err, data) {
// 		nodeUtil.p2jinfo("Load PDF file status:" + (!!err ? "Error!" : "Success!") );
// 		if (err) {
// 			this.data = err;
// 			this.emit("pdfParser_dataError", this);
// 		}
// 		else {
// 			_binBuffer[this.pdfFilePath] = data;
// 			_startParsingPDF.call(this);
// 		}
// 	};

// 	let _createContentStream = function(jsonObj) {
// 		let rStream = new stream.Readable({objectMode: true});
// 		rStream.push(jsonObj);
// 		rStream.push(null);
// 		return rStream;
// 	};

// 	// constructor
//     function PdfParser(context, needRawText) {
// 		//call constructor for super class
// 	    stream.Transform.call(this, {objectMode: true, bufferSize: 64 * 1024});
	
//         // private
//         let _id = _nextId++;

//         // public (every instance will have their own copy of these methods, needs to be lightweight)
//         this.get_id = () => _id;
//         this.get_name = () => _name + _id;

//         // service context object, only used in Web Service project; null in command line
//         this.context = context;

//         this.pdfFilePath = null; //current PDF file to load and parse, null means loading/parsing not started
//         this.data = null; //if file read success, data is PDF content; if failed, data is "err" object
//         this.PDFJS = new PDFJS(needRawText);
//         this.processFieldInfoXML = false;//disable additional _fieldInfo.xml parsing and merging

// 	    this.chunks = [];
// 	    this.flushCallback = null;
// 	}
// 	// inherit from event emitter
// 	nodeUtil.inherits(PdfParser, stream.Transform);

// 	//implements transform stream
// 	PdfParser.prototype._transform = function (chunk, enc, callback) {
// 		this.chunks.push(Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk, enc));
// 		callback();
// 	};

// 	PdfParser.prototype._flush = function(callback) {
// 		this.flushCallback = callback;
// 		this.parseBuffer(Buffer.concat(this.chunks));
// 	};

// 	PdfParser.prototype.fq = async.queue( (task, callback) => {
// 		fs.readFile(task.path, callback);
// 	}, 100);

// 	//public APIs
// 	PdfParser.prototype.setVerbosity = function(verbosity) {
// 		nodeUtil.verbosity(verbosity || 0);
// 	};

// 	PdfParser.prototype.loadPDF = function(pdfFilePath, verbosity) {
// 		this.setVerbosity(verbosity);
// 		nodeUtil.p2jinfo("about to load PDF file " + pdfFilePath);

// 		this.pdfFilePath = pdfFilePath;
// 		if (this.processFieldInfoXML) {
// 			this.PDFJS.tryLoadFieldInfoXML(pdfFilePath);
// 		}

// 		if (_processBinaryCache.call(this))
// 			return;

// 		this.fq.push({path: pdfFilePath}, _processPDFContent.bind(this));
// 	};

// 	// Introduce a way to directly process buffers without the need to write it to a temporary file
// 	PdfParser.prototype.parseBuffer = function(pdfBuffer) {
// 		_startParsingPDF.call(this, pdfBuffer);
// 	};

// 	PdfParser.prototype.getRawTextContent = function() { return this.PDFJS.getRawTextContent(); };
// 	PdfParser.prototype.getRawTextContentStream = function() { return _createContentStream(this.getRawTextContent()); };

// 	PdfParser.prototype.getAllFieldsTypes = function() { return this.PDFJS.getAllFieldsTypes(); };
// 	PdfParser.prototype.getAllFieldsTypesStream = function() { return _createContentStream(this.getAllFieldsTypes()); };

// 	PdfParser.prototype.getMergedTextBlocksIfNeeded = function() { return {"formImage": this.PDFJS.getMergedTextBlocksIfNeeded()}; };
// 	PdfParser.prototype.getMergedTextBlocksStream = function() { return _createContentStream(this.getMergedTextBlocksIfNeeded()); };

// 	PdfParser.prototype.destroy = function() {
// 		this.removeAllListeners();

// 		//context object will be set in Web Service project, but not in command line utility
// 		if (this.context) {
// 			this.context.destroy();
// 			this.context = null;
// 		}

// 		this.pdfFilePath = null;
// 		this.data = null;
// 		this.chunks = null;

// 		this.PDFJS.destroy();
// 		this.PDFJS = null;
// 	};

// 	return PdfParser;
// })();

// module.exports = PDFParser;