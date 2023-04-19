const { default: axios } = require("axios");
const fs = require("fs-extra");
const tryCatch = require("../../middleware/catchAsyncErr");
const { wsSend, writeMetadata } = require("../../utils/helpers");
const path = require("path");
const l = console.log;

const fetchTranslations = async (linearray, languageToTranslate) => {
  try {
    const translationdata = await axios.post(
      process.env.TRANSLATE_SERVICE_URL,
      {
        text: linearray,
        target_lang: languageToTranslate,
      }
    );
    l("translationdata :", translationdata);
    const translations = translationdata.data;
    console.log("translations :", translations);
    return translations;
  } catch (error) {
    console.error("error fetching translations :", error.message);
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
  l("Languages to Translate :", languagesToTranslate);
  try {
    // Paths
    const transcriptionsFolderOfUserPath = transcriptionOutputPath;

    const translationFolder = path.join(
      transcriptionsFolderOfUserPath,
      "translations"
    );
    const vttFilePath = path.join(
      transcriptionsFolderOfUserPath,
      `${uploadedFileName}.vtt`
    );

    //  ------

    const vttFile = await fs.readFile(vttFilePath, "utf8");
    console.log("vttFile:", vttFile);

    if (!vttFile) {
      throw new Error("VTT file not found");
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

    wsSend(socket, {
      status: "progress",
      serviceRunning: "translate",
      message: "starting Translations",
    });

    l("timeCodes :", timeCodes);

 let errInTranslationCount = 0;

    await Promise.all(
      languagesToTranslate.map(async (lang) => {
        try {
          wsSend(socket, {
            status: "progress",
            serviceRunning: "translate",
            message: `starting Translation of ${lang}`,
          });

          const translatedLines = await fetchTranslations(
            linesToTranslate,
            lang
          );

          l("translatedLines :", translatedLines);

          if (!translatedLines) {
            return;
          }

          const outputVttFilePath = path.join(
            translationFolder,
            `${uploadedFileName}_${lang}.vtt`
          );

          let translatedVtt = "WEBVTT\n";

          for (const [index, value] of translatedLines.entries()) {
            translatedVtt += `\n${timeCodes[index]}\n${value}\n`;
          }

          await fs.writeFile(outputVttFilePath, translatedVtt, "utf8");
        } catch (error) {
          console.error("error in translation Process", error.message);
          wsSend(socket, {
            status: "progress",
            serviceRunning: "translate",
            message: `Error occoured in Translation of ${lang}` ,
          })
          errInTranslationCount++;
          return;
        }
      })
    );

    if(errInTranslationCount == languagesToTranslate.length){
     throw new Error("Error occoured in Translation Process");
    }

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
  }
};

module.exports = translate;
