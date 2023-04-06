const {
  downloadFileApi,
  getFilename,
} = require("../downloading/yt-dlp-download");
const fs = require("fs-extra");
const transcribeAndTranslate = require("../transcribeAndTranslate/transcribeAndTranslate");

const l = console.log;
// generate random 10 digit number
function generateRandomNumber() {
  return Math.floor(Math.random() * 10000000000).toString();
}

const tryCatch = require("../middleware/catchAsyncErr");
const ErrorHandler = require("../utils/ErrorHandler");

exports.initiateTranscribingService = tryCatch(async (req, res, next) => {

    const file = req.file;
    l(req.body);
    const { language, model, ytdlink } = req.body;

    const isenmodel = model.split(".")[1] === "en";
    l("isenmodel :", isenmodel);

    const lang = language === "auto-detect" ? isenmodel ? "en" : null : language;
    l("lang :", lang);

    const numberToUse = generateRandomNumber();

    const downloadLink = ytdlink || null;
    l("dowmloadlink :", downloadLink);

    let originalFileName, uploadFileName, uploadFilePath;
    if (file) {
      originalFileName = file.originalname;
      uploadFileName = file.filename;
      uploadFilePath = file.path;
    }

    //!! if both not prvided
    if (!file && !ytdlink) {
     return next(new ErrorHandler("No file or youtube link provided", 400));
    }

    //!! if both  prvided

    if (file && ytdlink) {
      return next(new ErrorHandler("Both file and youtube link provided", 400));
    }

    let filename;
    if (downloadLink) {
      l("checking download link");
      // hit yt-dlp and get file title name
      filename = await getFilename(downloadLink);
    } else {
      filename = uploadFileName;
    }

    fs.mkdirp(`${process.cwd()}/transcriptions/${numberToUse}`);

    // const host = "https://transcribeservice.herokuapp.com";
    const host = "http://localhost:5001"

    const transcriptionOutputPath = `${process.cwd()}/transcriptions/${numberToUse}`;
    l("uploaded filename :",filename);

    if (downloadLink) {
        res.status(200).json({
        message: "starting-transcription",
        // where the data will be sent from
        transcribeDataEndpoint: `${host}/api/${numberToUse}`,
        fileTitle: filename,
      });
    } else {
        res.status(200).json({
        message: "starting-transcription",
        // where the data will be sent from
        transcribeDataEndpoint: `${host}/api/${numberToUse}`,
        fileTitle: filename,
      });
    }

    await transcribeAndTranslate({
      language: lang,
      model,
      uploadFileName,
      originalFileName,
      uploadFilePath,
      transcriptionOutputPath,
      numberToUse
    });

    // const directoryName = makeFileNameSafe(filename)

    // l(directoryName)

    // res.status(200).json({
    //   file,
    //   model,
    //   language,
    //   filename,
    // });

})

exports.getTranscribedFile = async (req, res, next) => {};
