const tryCatch = require('../middleware/catchAsyncErr');

const buildArguments = ({
    uploadedFilePath,
    language,
    model,
    compute_type,
    numberToUse
  }) => {
    /** INSTANTIATE WHISPER PROCESS **/
      // queue up arguments, path is the first one
    let arguments = [];
  
    // first argument is path to file
    arguments.push(uploadedFilePath);
  
    // these don't have to be defined
    if (language) arguments.push('--language', language);
    if (model) arguments.push('--model', model);
    arguments.push('--compute_type', compute_type);
    // dont show the text output but show the progress thing
    // arguments.push('--verbose', 'False');
  
    // // folder to save .txt, .vtt and .srt
    // arguments.push('--output_dir', `transcriptions/${numberToUse}`);
  
    l('transcribe arguments');
    l(arguments);
  
    return arguments
  }


  const handleProcessClose = ({  originalUpload, numberToUse }) => {
    return function (code) {
      (tryCatch(async () => {
        l(`PROCESS FINISHED WITH CODE: ${code}`)
  
        const processFinishedSuccessfullyBasedOnStatusCode = code === 0;
  
        // if process failed
        if (!processFinishedSuccessfullyBasedOnStatusCode) {
          // if process errored out
          // await writeToProcessingDataFile(processingDataPath, {
          //   status: 'error',
          //   error: 'whisper process failed'
          // })
  
          // throw error if failed

          throw new Error('whisper process failed')
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
    
        }
      })())
    }
  }

  module.exports = {
    buildArguments,
  handleProcessClose
  }