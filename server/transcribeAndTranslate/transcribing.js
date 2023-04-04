function buildArguments ({
    uploadedFilePath,
    language,
    model,
    numberToUse
  }) {
    /** INSTANTIATE WHISPER PROCESS **/
      // queue up arguments, path is the first one
    let arguments = [];
  
    // first argument is path to file
    arguments.push(uploadedFilePath);
  
    // these don't have to be defined
    if (language) arguments.push('--language', language);
    if (model) arguments.push('--model', model);
  
    // dont show the text output but show the progress thing
    arguments.push('--verbose', 'False');
  
    // folder to save .txt, .vtt and .srt
    arguments.push('-o', `transcriptions/${numberToUse}`);
  
    l('transcribe arguments');
    l(arguments);
  
    return arguments
  }

  module.exports = {
    buildArguments
  }