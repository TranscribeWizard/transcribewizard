const { writeMetadata, wsSend } = require("../../../utils/helpers");
const tryCatch = require("../../../middleware/catchAsyncErr");
const translate = require("../../translate");

const l = console.log;

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
  // arguments.push("--compute_type", compute_type);
  arguments.push("--verbose", "False");
  // arguments.push("--word_timestamps", "True");
  arguments.push("--output_dir", `media/transcriptions/${numberToUse}`);

  l("transcribe arguments");
  l(arguments);

  return arguments;
};

const ten = "94%|█████████▍| 13.0/13.7813125 [00:00<00:00, 17.19seconds/s]";

// TODO : Handle false return value

function formatStdErr(stdErrData) {
  // if a progress output
  if (stdErrData.includes("seconds/s")) {
    // looks like: '█         '
    const progressBar = stdErrData.split("|")[1].split("|")[0];

    // looks like: '10%'
    let percentDone = stdErrData.split("|")[0].trim();

    // looks like: 10
    let percentDoneAsNumber = Number(stdErrData.split("%")[0].trim());

    // looks like: '00:10<01:25, 545.77frames/s]'
    let timeLeftPortion = stdErrData.split("[")[1].split("[")[0];

    // looks like: '00:10<01:25'
    const firstPortion = timeLeftPortion.split(",")[0];

    // looks like: '00:10'
    const timeElapsed = firstPortion.split("<")[0];

    // looks like: '01:25'
    const timeRemainingString = timeLeftPortion.split("<")[1].split(",")[0];

    // looks like: '545.77'
    const speed = timeLeftPortion
      .split("<")[1]
      .split(",")[1]
      .split("seconds")[0]
      .trim();

    // looks like: '545.77'
    const splitTimeRemaining = timeRemainingString.split(":");

    // looks like: '01'
    const secondsRemaining = Number(splitTimeRemaining.pop());

    // looks like: '25'
    const minutesRemaining = Number(splitTimeRemaining.pop());

    // looks like: 'NaN'
    const hoursRemaining = Number(splitTimeRemaining.pop());

    // format for lib
    return {
      progressBar,
      percentDone,
      timeElapsed,
      speed,
      percentDoneAsNumber,
      timeRemaining: {
        string: timeRemainingString,
        hoursRemaining,
        minutesRemaining,
        secondsRemaining,
      },
    };
  } else {
    return false;
  }
}

// print the latest progress and save it to the processing data file
const handleStdErr = ({ metaDataPath, socket }) => {
  return function (data) {
    tryCatch(async () => {
      l(`STDERR: ${data}`);

      const formattedProgress = formatStdErr(data.toString());
      l("formattedProgress :", formattedProgress);

      const { percentDoneAsNumber, percentDone, speed, timeRemaining } =
        formattedProgress;
        
      if (percentDoneAsNumber) {
        wsSend(socket, {
          type: "initiateTranscribingService",
          message: "Transcription in progress...",
          serviceRunning: "transcribe",
          status: "progress",
          percent: percentDoneAsNumber,
          timeRemaining: timeRemaining,
        });

        l(`percentDoneAsNumber: ${percentDoneAsNumber}`);
        l(`percentDone: `, percentDone);
        l(`speed: `, speed);
        l(`timeRemaining: `, timeRemaining);
      }

    })();
  };
};

const handleProcessClose = ({
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
}) => {
  return function (code) {
    tryCatch(async () => {
      l(`PROCESS FINISHED WITH CODE: ${code}`);

      const processFinishedSuccessfullyBasedOnStatusCode = code === 0;

      if (!processFinishedSuccessfullyBasedOnStatusCode) {
        writeMetadata(metaDataPath, {
          status: "error",
          serviceRunning: "transcribe",
          message: "Transcription Failed",
        });

        wsSend(socket, {
          type: "initiateTranscribingService",
          serviceRunning: "transcribe",
          message: "Transcription Failed",
          status: "error",
        });

        reject(new Error("whisper process failed"));
      } else {
        l("Translation started");

        if (shouldTranslate) {
          writeMetadata(metaDataPath, {
            status: "progress",
            serviceRunning: "translate",
            message: "Translation in progress...",
          });

          wsSend(socket, {
            type: "initiateTranscribingService",
            serviceRunning: "translate",
            message: "Initializing Translation Service",
            status: "progress",
          });

          try {
            await translate({
              languagesToTranslate,
              uploadedFilePath,
              transcriptionOutputPath,
              numberToUse,
              uploadedFileName,
              originalFileName,
              uploadedFilePath,
              socket,
              metaDataPath,
            });
          } catch (error) {
            l("error from translate:", error);

            writeMetadata(metaDataPath, {
              status: "error",
              serviceRunning: "translate",
              message: "Translation Failed",
            });

            wsSend(socket, {
              type: "initiateTranscribingService",
              serviceRunning: "translate",
              message: "Translation Failed",
              status: "error",
            });
          }
        } else {
          writeMetadata(metaDataPath, {
            status: "completed",
            message: "Transcription Process Completed",
          });

          wsSend(socket, {
            type: "initiateTranscribingService",
            message: "Transcription Process Completed",
            status: "completed",
          });

          resolve(true);
        }

        l("whisper process finished successfully");
      }
    })();
  };
};

module.exports = {
  buildArguments,
  handleProcessClose,
  handleStdErr,
};
