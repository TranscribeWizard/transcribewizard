const { default: axios } = require("axios");
const fs = require("fs-extra");
const tryCatch = require("../../middleware/catchAsyncErr");
const { wsSend, writeMetadata } = require("../../utils/helpers");
const l = console.log;

const fetchTranslations = async (linearray, languageToTranslate) => {
  try {
    const translationdata = await axios.post(process.env.TRANSLATE_SERVICE_URL, {
      text: linearray,
      target_lang: languageToTranslate,
    });
    l("translationdata :", translationdata);
    const translations = translationdata.data;
    console.log("translations :", translations);
    return translations;
  } catch (error) {
    console.error("error fetching translations", error);
    throw error;
  }
};

const translate = async ({
  languagesToTranslate,
  originalFileName,
  uploadedFileName,
  uploadedFilePath,
  transcriptionOutputPath,
  numberToUse,
  metaDataPath,
  socket,
}) => {
  return tryCatch(
    new Promise(async (resolve, reject) => {
      l("Languages to Translate :", languagesToTranslate);
      l("i should be last");
      const transcriptionsFilePath = `${process.cwd()}/media/transcriptions/${numberToUse}`;
      const translationFolder = transcriptionsFilePath + "/translations";
      const vttFilePath =
        transcriptionsFilePath + "/" + uploadedFileName + ".vtt";

      let vttFile;

      try {
        vttFile = fs.readFileSync(vttFilePath, "utf8");
        l("vtt file :", vttFile);
      } catch (error) {
        l("error reading vtt file :", error);
        return ;
      }
      if (!vttFile) {
        reject("vtt file not found");
      }
      const cueswithwebvtt = vttFile.split("\n\n");
      const cues = cueswithwebvtt.slice(1);

      let linesToTranslate = [];
      let timeCodes = [];

      for (const cue of cues) {
        l("Cue :", cue);
        const cueLines = cue.split("\n");
        const timeCode = cueLines.shift();
        l("timeCode of a singleLine:", timeCode);
        timeCodes.push(timeCode);
        linesToTranslate.push(...cueLines);
      }

      try {
        wsSend(socket, {
          status: "progress",
          serviceRunning: "translate",
          message: "starting Translations",
        });

        l("timeCodes :", timeCodes);
      
        await Promise.all(languagesToTranslate.map(async (lang) => {
          wsSend(socket, {
            status: "progress",
            serviceRunning: "translate",
            message: `starting Translation of ${lang}`,
          });
      try {
        const translatedLines = await fetchTranslations(linesToTranslate, lang);
      } catch (error) {
        return reject(error);
      }
          l("translatedLines :", translatedLines);

          if(!translatedLines){
             return
          }
            const outputVttFilePath = translationFolder + "/" + uploadedFileName + "_" + lang + ".vtt";
            let formattedVtt = "WEBVTT\n";
      
            for (const [index, value] of translatedLines.entries()) {
              formattedVtt += `\n${timeCodes[index]}\n${value}\n`;
            }
            
            try {
              fs.writeFileSync(outputVttFilePath, formattedVtt, "utf8");
              l({
                langTranslated: lang,
                path: outputVttFilePath,
              });
            } catch (error) {
              console.error("error writing vtt file for translations", error);
              reject(error);
            }
        
        }));
      
        
      
        writeMetadata(metaDataPath, {
          status: "completed",
          serviceRunning: "translate",
          message: "Translations Done Successfully",
        });
      
        wsSend(socket, {
          status: "completed",
          serviceRunning: "translate",
          message: "Translations Done Successfully",
        });
      
        resolve();
      } catch (error) {
        writeMetadata(metaDataPath, {
          status: "error",
          serviceRunning: "translate",
          message: error.message,
        });
      
        wsSend(socket, {
          status: "error",
          serviceRunning: "translate",
          message: error.message,
        });
      
        console.error(error);
        reject(error);
      }
      
    })
  );
};

module.exports = translate;
