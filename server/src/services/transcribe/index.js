const which = require("which");
const tryCatch = require("../../middleware/catchAsyncErr");
const spawn = require("child_process").spawn;
const {
  handleProcessClose,
  buildArguments,
  handleStdErr,
} = require("./helpers");
const fs = require("fs-extra");
const ErrorHandler = require("../../utils/ErrorHandler");
const { wsSend } = require("../../utils/helpers");

l = console.log;

const whisperPath = which.sync("whisper-ctranslate2");

const transcribe = async ({
  language,
  model,
  uploadedFileName,
  originalFileName,
  uploadedFilePath,
  transcriptionOutputPath,
  shouldTranslate,
  languagesToTranslate,
  numberToUse,
  socket,
}) => {
  return tryCatch(
    new Promise(async (resolve, reject) => {
      const metaDataPath = `media/transcriptions/${numberToUse}/metadata.json`;

      let translationFolderPath;
      if (shouldTranslate) {
        l("shouldTranslate :", shouldTranslate);
        translationFolderPath = `media/transcriptions/${numberToUse}/translations`;
        await fs.mkdir(translationFolderPath, { recursive: true });
      }

      try {
        await fs.writeFile(
          metaDataPath,
          JSON.stringify({
            originalFileName,
            uploadedFileName,
            uploadedFilePath,
            shouldTranslate,
            languagesToTranslate,
            translationFolderPath,
            status: "progress",
            message: "Transcription in progress...",
          }),
          { flag: "w+" }
        );
      } catch (error) {
        console.error(`Error writing metadata file: ${error}`);
        return reject(new Error("Error writing metadata file"));
      }

      wsSend(socket, {
        type: "initiateTranscribingService",
        message: "Transcription just started...",
        serviceRunning: "transcribe",
        status: "progress",
        percent: 0,
        timeRemaining: "Calculating...",
      });

      const startingDate = new Date();
      l(startingDate);

      const whisperArguments = buildArguments({
        uploadedFilePath,
        language,
        model,
        compute_type: "int8",
        numberToUse,
      });

      l("whisperArguments");
      l(whisperArguments);

 
        
        // start whisper process
        const whisperProcess = spawn(whisperPath, whisperArguments);

        whisperProcess.stdout.on("data", (data) => l(`STDOUT: ${data}`));
        
        whisperProcess.stderr.on("data", handleStdErr({ metaDataPath, socket }));
        
      whisperProcess.on(
        "close",
        handleProcessClose({
          metaDataPath,
          socket,
          resolve,
          reject,
          shouldTranslate,
          languagesToTranslate,
          numberToUse,
          transcriptionOutputPath,
          uploadedFileName,
          originalFileName,
          uploadedFilePath,
        })
        );
  
    })
  );
};

module.exports = transcribe;
