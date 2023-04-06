const { formatStdErr } = require("../../../utils/helpers");
const tryCatch = require("../../../middleware/catchAsyncErr");

const buildArguments = ({
  uploadedFilePath,
  language,
  model,
  compute_type,
  numberToUse,
}) => {

  let arguments = [];

  arguments.push(uploadedFilePath);
  if (language) arguments.push("--language", language);
  if (model) arguments.push("--model", model);
  arguments.push("--compute_type", compute_type);
  arguments.push("--verbose", "False");
  arguments.push("--output_dir", `media/transcriptions/${numberToUse}`);

  l("transcribe arguments");
  l(arguments);

  return arguments;
};


// print the latest progress and save it to the processing data file
const  handleStdErr = () => {
   return function (data) {
     (tryCatch(async () => {
       l(`STDERR: ${data}`)
 
       // get value from the whisper output string
       const formattedProgress = formatStdErr(data.toString());
       l('formattedProgress');
       l(formattedProgress);
 
       const { percentDoneAsNumber, percentDone, speed, timeRemaining  } = formattedProgress;
 
       l(`percentDoneAsNumber: ${percentDoneAsNumber}`);
       l(`percentDone: `, percentDone);
       l(`speed: `, speed);
       l(`timeRemaining: `, timeRemaining);
 
     }))()
   }
 }

const handleProcessClose = ({ originalUpload, numberToUse }) => {
  return function (code) {
    tryCatch(async () => {
      l(`PROCESS FINISHED WITH CODE: ${code}`);

      const processFinishedSuccessfullyBasedOnStatusCode = code === 0;

      // if process failed
      if (!processFinishedSuccessfullyBasedOnStatusCode) {
        // if process errored out
        // await writeToProcessingDataFile(processingDataPath, {
        //   status: 'error',
        //   error: 'whisper process failed'
        // })

        // throw error if failed

        throw new Error("whisper process failed");
      } else {
        // // TODO: pass file extension to this function
        // const fileExtension = originalUpload.split('.').pop();
        //
        // // rename whisper created files
        // await moveFiles(numberToUse, fileExtension)
        // save mark upload as completed transcribing
        // await writeToProcessingDataFile(processingDataPath, {
        //   status: 'completed',
        // })
        l('whisper process finished successfully');
      }
    })();
  };
};

module.exports = {
  buildArguments,
  handleProcessClose,
  handleStdErr
};
