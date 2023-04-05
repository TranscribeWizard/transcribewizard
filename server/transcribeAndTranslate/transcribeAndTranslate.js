const which = require("which");
const tryCatch = require("../middleware/catchAsyncErr");
const spawn = require("child_process").spawn;
const { handleProcessClose } = require("./transcribing");

const { buildArguments } = require("./transcribing");

l = console.log;

const whisperPath = which.sync("whisper-ctranslate2");

const transcribeAndTranslate = tryCatch(
  async ({
    language,
    model,
    uploadFileName,
    originalFileName,
    uploadFilePath,
    transcriptionOutputPath,
    numberToUse,
    next
  }) => {
    return new Promise(async (resolve, reject) => {
     
        // where app.js is running from
        const processDir = process.cwd();

        // original upload file path
        const originalUpload = `${processDir}/uploads/${uploadFileName}`;

        //
        // const processingDataPath = `${processDir}/transcriptions/${numberToUse}/processing_data.json`

        // save date when starting to see how long it's taking
        const startingDate = new Date();
        l(startingDate);

        const whisperArguments = buildArguments({
          uploadedFilePath: uploadFilePath, // file to use
          language, //
          model,
          compute_type: "int8",
          numberToUse,
        });

        l("whisperArguments");
        l(whisperArguments);

        // start whisper process
        const whisperProcess = spawn(whisperPath, whisperArguments);
        l(whisperProcess)
        // // TODO: implement foundLanguagae here
        // // let foundLanguage;
        whisperProcess.stdout.on('data',  (data) => l(`STDOUT: ${data}`));

        // /** console output from stderr **/ // (progress comes through stderr for some reason)
        whisperProcess.stderr.on("data", (data) => l(`STDERR: ${data}`));

        // /** whisper responds with 0 or 1 process code **/
        whisperProcess.on(
          "close",
          handleProcessClose({ originalUpload, numberToUse })
        );
    });
  }
);

module.exports = transcribeAndTranslate;
