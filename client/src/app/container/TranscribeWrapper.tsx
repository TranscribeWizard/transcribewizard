"use client";

import { useAppContext } from "@/app/contexts/Providers";
import UploadForm from "./UploadForm";
import { Toaster } from "react-hot-toast";
import TranscribeInProcess from "./TranscribeInProcess";
import { useEffect, useState } from "react";
import { notify } from "@/utils/notify";
import JSZip from "jszip";

type TranscribedFile = {
  url: string;
  ogFilename: string;
} | null;

interface Result {
  [key: string]: JSZip.JSZipObject;
}

export default function TranscribeWrapper() {
  const [transcribedFile, setTranscribedFile] = useState<TranscribedFile>(null);
  const [vttUrls, setVttUrls] = useState<Record<string, string>>({});
  const {
    transcriptionstarted,
    message,
    errorwhiletranscription,
    transcriptioninPercent,
    transcriptionCompleted,
    transcribeDataEndpoint,
    errorWhileTranslation,
    shouldTranslate,
  } = useAppContext();
  console.log(transcriptionstarted);
  console.log("is error :", errorwhiletranscription);

  useEffect(() => {
    async function fetchTranscription() {
      if (
        (transcriptionCompleted && transcribeDataEndpoint) ||
        (shouldTranslate && errorWhileTranslation)
      ) {
        try {
          const response = await fetch(transcribeDataEndpoint);

          if (response.headers.get("Content-Type") === "application/zip") {
            const zip = new JSZip();
            const result = await zip.loadAsync(await response.arrayBuffer());
            const urls: Record<string, string> = {};

            await Promise.all(
              Object.keys(result.files).map(async (relativePath) => {
                const file = result.files[relativePath];
                const content = await file.async("uint8array");
                const blob = new Blob([content], {
                  type: "application/octet-stream",
                });
                urls[relativePath] = URL.createObjectURL(blob);
              })
            );

            setVttUrls(urls);
          } else {
            // If the response is a vtt file
            const responsedata = await response.json();
            if (responsedata.success) {
              const { vtt, ogFilename } = responsedata;
              const vttFile = new Blob([vtt], { type: "text/vtt" });
              const vttFileUrl = URL.createObjectURL(vttFile);
              setTranscribedFile({
                url: vttFileUrl,
                ogFilename: ogFilename,
              });
             errorWhileTranslation? notify(responsedata.message, "error") : notify(responsedata.message, "success");
            } else {
              setTranscribedFile(null);
              console.error(responsedata.message);
              notify("Error while fetching transcription", "error");
            }
          }
        } catch (error) {
          console.error(error);
          setTranscribedFile(null);
          notify("Error while fetching transcription", "error");
        }
      }
    }
    fetchTranscription();
  }, [
    transcriptionCompleted,
    transcribeDataEndpoint,
    errorWhileTranslation,
    shouldTranslate,
  ]);

  const isvttUrls = vttUrls && Object.keys(vttUrls).length > 0;

  return (
    <>
      <div>
        {!transcriptionstarted ? (
          <UploadForm />
        ) : !transcribedFile && !isvttUrls ? (
          <TranscribeInProcess
            error={
              errorwhiletranscription
                ? true
                : errorWhileTranslation
                ? true
                : false
            }
            message={message}
            PercentageDone={transcriptioninPercent}
          />
        ) : (
          <div className="text-center flex flex-col gap-5 justify-center items-center">
            <h5 className="">Here is your transcription of</h5>
            {transcribedFile ? (
              <>
                <h2>{transcribedFile.ogFilename}</h2>
                <a
                  href={transcribedFile.url}
                  download={transcribedFile.ogFilename + ".vtt"}
                  className="btn"
                >
                  Download Transcription
                </a>
              </>
            ) : (
              <>
                {isvttUrls &&
                  Object.keys(vttUrls).map((key) => {
                    return (
                      <>
                        <h2>{key}</h2>
                        <a
                          href={vttUrls[key]}
                          download={key + ".vtt"}
                          className="btn"
                        >
                          Download Transcription
                        </a>
                      </>
                    );
                  })}
              </>
            )}
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}
