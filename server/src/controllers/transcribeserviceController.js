const {
  downloadFileApi,
  getFilename,
} = require("../utils/downloading/yt-dlp-download");
const fs = require("fs-extra");
const transcribe = require("../services/transcribe");
const {
  generateRandomNumber,
  makeFileNameSafe,
  wsSend,
} = require("../utils/helpers");
const tryCatch = require("../middleware/catchAsyncErr");
const ErrorHandler = require("../utils/ErrorHandler");
const { getWebsocket } = require("../utils/webSocket");
const JSZip = require("jszip");

const l = console.log;

exports.initiateTranscribingService = tryCatch(async (req, res, next) => {
  const ws = getWebsocket();
  const file = req.file;
  l("-----------\nrequest body",req.body,'-----------\n');

  const { language, model, ytdlink, languagesToTranslateString } = req.body;

  let languagesToTranslate;
  if (languagesToTranslateString) {
    languagesToTranslate = languagesToTranslateString.split(",");
  }

  const shouldTranslate = languagesToTranslate[0] ? true : false;

  const isenmodel = model.split(".")[1] === "en";

  const lang =
    language === "auto-detect" ? (isenmodel ? "en" : null) : language;

  const numberToUse = generateRandomNumber();

  const downloadLink = ytdlink || null;

  let originalFileName, uploadedFileName, uploadedFilePath;
  if (file) {
    originalFileName = file.originalname;
    uploadedFileName = file.filename;
    uploadedFilePath = file.path;
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
    l("checking download link :", downloadLink);
    filename = await getFilename(downloadLink);
  } else {
    filename = uploadedFileName;
  }
  const transcriptionOutputPath = `${process.cwd()}/media/transcriptions/${numberToUse}`;

  fs.mkdirSync(transcriptionOutputPath);

  const host = "http://localhost:5001";

  if (downloadLink) {
    res.status(200).json({
      message: "Download Started",
      estTimeInSec: 60,
      success: true,
      transcribeDataEndpoint: `${host}/api/v1/transcribe/${numberToUse}`,
      fileTitle: filename,
    });
  } else {
    res.status(200).json({
      message: "Transcription Started",
      success: true,
      shouldTranslate,
      estTimeInSec: 20,
      transcribeDataEndpoint: `${host}/api/v1/transcribe/${numberToUse}`,
      fileTitle: filename,
    });
    wsSend(ws, {
      type: "initiateTranscribingService",
      numberToUse,
      message: "initiated transcribing service",
      serviceRunning: "transcribe",
      originalFileName,
      uploadedFileName,
      uploadedFilePath,
      transcriptionOutputPath,
      status: "progress",
    });
  }

  try{
  await transcribe({
    language: lang,
    model,
    uploadedFileName,
    originalFileName,
    uploadedFilePath,
    transcriptionOutputPath,
    shouldTranslate: languagesToTranslate[0] ? true : false,
    languagesToTranslate,
    numberToUse,
    socket: ws,
  });
  l("i am completed but translation is running...");
} catch (error) {
  l("error from transcribe service :", error);
}
});

exports.getTranscribedFile = tryCatch(async (req, res, next) => {
  const { transcribedFolderID } = req.params;

  const metadataPath = `media/transcriptions/${transcribedFolderID}/metadata.json`;

  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  } catch (error) {
    console.error(`Error reading metadata file: ${error}`);
    return next(new ErrorHandler("Error reading metadata file", 500));
  }

  const {
    originalFileName,
    uploadedFileName,
    status,
    message,
    shouldTranslate,
    serviceRunning,
    languagesToTranslate,
    translationFolderPath,
  } = metadata;

  const transcriptionOutputPath = `${process.cwd()}/media/transcriptions/${transcribedFolderID}/${uploadedFileName}.vtt`;

  if (status == "progress") {
    return res.status(200).json({
      message,
      hint: "send a request again after the estimated time",
      success: true,
      serviceRunning,
      estTimeInSec: 10,
    });
  }

  if (status == "error" && !shouldTranslate) {
    return next(new ErrorHandler("Error occurred during transcription", 500));
  }

  if (status == "error" && shouldTranslate && serviceRunning == "transcribe") {
    return next(new ErrorHandler("Error occurred during transcription", 500));
  }

  const isErrorInTranslating =
    status == "error" && shouldTranslate && serviceRunning == "translate";

  const safeOriginalName = makeFileNameSafe(originalFileName);

  let ogVtt;

  ogVtt = fs.readFileSync(transcriptionOutputPath, "utf8");

  if (shouldTranslate && !isErrorInTranslating) {
    let translatedVtts = [];

    for (lang of languagesToTranslate) {
      let translatedVtt = fs.readFileSync(
        `${translationFolderPath}/${uploadedFileName + "_" + lang}.vtt`,
        "utf8"
      );
      translatedVtts.push({
        vttNameForAttachment: `${safeOriginalName + "_" + lang}.vtt`,
        translatedVtt,
      });
    }

    const zip = new JSZip();
    zip.file(`${safeOriginalName}.vtt`, ogVtt);
    for (let i = 0; i < translatedVtts.length; i++) {
      zip.file(
        translatedVtts[i].vttNameForAttachment,
        translatedVtts[i].translatedVtt
      );
    }
    
    zip
      .generateAsync({ type: "nodebuffer" })
      .then((content) => {
        res.set({
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${safeOriginalName}.zip"`,
        });
        res.status(200).send(content);
      })
      .catch((error) => {
        console.error(`Error creating zip file: ${error}`);
        return next(new ErrorHandler("Error creating zip file", 500));
      });

  } else {
    if (isErrorInTranslating) {
      res.set({
        "Content-Type": "text/vtt",
        "Content-Disposition": `attachment; filename="${safeOriginalName}.vtt"`,
      });
      res.status(200).send(ogVtt);
    } else {
      res.set({
        "Content-Type": "text/vtt",
        "Content-Disposition": `attachment; filename="${safeOriginalName}.vtt"`,
      });
      res.status(200).send(ogVtt);
    }
  }
});
