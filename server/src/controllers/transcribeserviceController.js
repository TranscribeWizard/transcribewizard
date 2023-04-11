const {
  downloadFileApi,
  getFilename,
} = require("../utils/downloading/yt-dlp-download");
const fs = require("fs-extra");
const transcribe = require("../services/transcribe");
const { generateRandomNumber, makeFileNameSafe } = require("../utils/helpers");
const tryCatch = require("../middleware/catchAsyncErr");
const ErrorHandler = require("../utils/ErrorHandler");

const l = console.log;

exports.initiateTranscribingService = tryCatch(async (req, res, next) => {
  const file = req.file;
  l(req.body);

  const { language, model, ytdlink } = req.body;

  const isenmodel = model.split(".")[1] === "en";
  l("isenmodel :", isenmodel);

  const lang =
    language === "auto-detect" ? (isenmodel ? "en" : null) : language;
  l("lang :", lang);

  const numberToUse = generateRandomNumber();

  const downloadLink = ytdlink || null;
  l("dowmloadlink :", downloadLink);

  let originalFileName, uploadedFileName, uploadedFilePath;
  if (file) {
    originalFileName = file.originalname;
    uploadedFileName = file.filename;
    uploadedFilePath = file.path;
  }

  l("uploadfile path :", uploadedFilePath);

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
    filename = uploadedFileName;
  }

  fs.mkdirp(`${process.cwd()}/media/transcriptions/${numberToUse}`);

  const host = "http://localhost:5001";

  const transcriptionOutputPath = `${process.cwd()}/media/transcriptions/${numberToUse}`;

  l("uploaded filename :", filename);

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
      estTimeInSec: 20,
      transcribeDataEndpoint: `${host}/api/v1/transcribe/${numberToUse}`,
      fileTitle: filename,
    });
  }

  await transcribe({
    language: lang,
    model,
    uploadedFileName,
    originalFileName,
    uploadedFilePath,
    transcriptionOutputPath,
    numberToUse,
  });
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
    percentDoneAsNumber,
    timeRemaining,
  } = metadata;
  const transcriptionOutputPath = `${process.cwd()}/media/transcriptions/${transcribedFolderID}/${uploadedFileName}.vtt`;

  if (status == "progress") {
    return res.status(200).json({
      message: "transcription is in process...",
      hint: "send a request again after the estimated time",
      success: true,
      estTimeInSec: 10,
      percentDoneAsNumber,
    });
  }

  if (status == "error") {
    return next(new ErrorHandler("Error occoured during transcription", 500));
  }

  const safeOriginalName = makeFileNameSafe(originalFileName);

  let vtt;
  try {
    vtt = fs.readFileSync(transcriptionOutputPath, "utf8");
  } catch (error) {
    console.error(`Error reading VTT file: ${error}`);
    return next(new ErrorHandler("Error reading VTT file", 500));
  }

  try {
    
      res.set({
        "Content-Type": "text/vtt",
        "Content-Disposition": `attachment; filename="${safeOriginalName}.vtt"`,
      });
      const additionalData = {
        message: "transcription completed",
        success: true,
        status: 'completed',
        ogFilename: safeOriginalName
      };
      res.status(200).send({ vtt, ...additionalData });
   
  } catch (error) {
    console.error(`Error sending response: ${error}`);
    return res.status(500).send("Error sending response");
  }
});
