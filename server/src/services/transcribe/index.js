const which = require("which");
const tryCatch = require("../../middleware/catchAsyncErr");
const spawn = require("child_process").spawn;
const { handleProcessClose, buildArguments, handleStdErr } = require("./helpers");

l = console.log;

const whisperPath = which.sync("whisper-ctranslate2");

const transcribe = async ({
  language,
  model,
  uploadedFileName,
  originalFileName,
  uploadedFilePath,
  transcriptionOutputPath,
  numberToUse,
}) => {
  return tryCatch(
    new Promise(async (resolve, reject) => {
      // where app.js is running from
      const processDir = process.cwd();

      // original upload file path
      const originalUpload = `${processDir}/src/media/uploads/${uploadFileName}`;

      //
      // const processingDataPath = `${processDir}/transcriptions/${numberToUse}/processing_data.json`

      // save date when starting to see how long it's taking
      const startingDate = new Date();
      l(startingDate);
      l(__dirname);

      const whisperArguments = buildArguments({
        uploadedFilePath: uploadFilePath, // file to use
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

      whisperProcess.stderr.on("data", handleStdErr());

      whisperProcess.on(
        "close",
        handleProcessClose({ originalUpload, numberToUse })
      );
    })
  );
};

module.exports = transcribe;
