
const {
  downloadFileApi,
  getFilename,
} = require("../downloading/yt-dlp-download");
const fs = require("fs-extra");


const l = console.log;
// generate random 10 digit number
function generateRandomNumber() {
  return Math.floor(Math.random() * 10000000000).toString();
}

exports.initiateTranscribingService = async (req, res, next) => {
  try {

// TODO: add language code instead of language name

    const file = req.file;
    l(req.body);
    const { language, model, ytdlink } = req.body;
    const isenmodel = model.split(".")[1] === "en";
    const lang = language === "auto-detect" && isenmodel ? "en" : language;
    const numberToUse = generateRandomNumber();
    const downloadLink = ytdlink;
    let originalFileName, uploadFileName, uploadFilePath;
    if (file) {
      originalFileName = file.originalname;
      uploadFileName = file.filename;
      uploadFilePath = file.path;
    }

    // if both not prvided
    if (!file && !ytdlink) {
      return res.status(400).json({
        msg: "No file or youtube link provided",
      });
    }

    // if both  prvided

    if (file && ytdlink) {
      return res.status(400).json({
        msg: "Provide file or url (any one)",
      });
    }

    let filename;
    if (downloadLink) {
      // hit yt-dlp and get file title name
      filename = await getFilename(downloadLink);
    } else {
      filename = uploadFileName;
    }

    fs.mkdirp(`${process.cwd()}/transcriptions/${numberToUse}`);
    const transcriptionOutputPath = `${process.cwd()}/transcriptions/${numberToUse}`;
    l(filename);

if(downloadLink){

}else{
  res.send({
    message: 'starting-transcription',
    // where the data will be sent from
    transcribeDataEndpoint: `${host}/api/${numberToUse}`,
    fileTitle: filename,})

}

await transcribeAndTranslate()
    // const directoryName = makeFileNameSafe(filename)

    // l(directoryName)

    res.status(200).json({
      file,
      model,
      language,
      filename,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

exports.getTranscribedFile = async (req, res, next) => {};
