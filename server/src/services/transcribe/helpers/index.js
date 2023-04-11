const { formatStdErr, writeMetadata } = require("../../../utils/helpers");
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
  arguments.push("--word_timestamps", "True");
  arguments.push("--output_dir", `media/transcriptions/${numberToUse}`);

  l("transcribe arguments");
  l(arguments);

  return arguments;
};


// print the latest progress and save it to the processing data file
const  handleStdErr = ({metaDataPath}) => {
   return function (data) {
     (tryCatch(async () => {
       l(`STDERR: ${data}`)
 
       // get value from the whisper output string
       const formattedProgress = formatStdErr(data.toString());
       l('formattedProgress');
       l(formattedProgress);
 
       const { percentDoneAsNumber, percentDone, speed, timeRemaining  } = formattedProgress;
       
       writeMetadata(metaDataPath, {
         status: 'progress',
         message:'Transcription in progress...',
         percentDoneAsNumber,
         timeRemaining
       })


       l(`percentDoneAsNumber: ${percentDoneAsNumber}`);
       l(`percentDone: `, percentDone);
       l(`speed: `, speed);
       l(`timeRemaining: `, timeRemaining);
 
     }))()
   }
 }

const handleProcessClose = ({metaDataPath }) => {
  return function (code) {
    tryCatch(async () => {
      l(`PROCESS FINISHED WITH CODE: ${code}`);

      const processFinishedSuccessfullyBasedOnStatusCode = code === 0;

      if (!processFinishedSuccessfullyBasedOnStatusCode) {

         writeMetadata(metaDataPath, {
          status: 'error',
          message: 'Transcription Failed'
        })

        throw new Error("whisper process failed");
      } else {

        writeMetadata(metaDataPath, {
          status: 'completed',
          message: 'Transcription Process Completed'

        })
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
