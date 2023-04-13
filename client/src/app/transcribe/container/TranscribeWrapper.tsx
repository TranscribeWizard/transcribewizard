"use client";

import { useAppContext } from "@/app/contexts/Providers";
import UploadForm from "./UploadForm";
import { Toaster } from "react-hot-toast";
import TranscribeInProcess from "./TranscribeInProcess";
import { useEffect, useState } from "react";
import { notify } from "@/utils/notify";

type TranscribedFile = {
  url: string;
  ogFilename: string;
} | null;

export default function TranscribeWrapper() {
  const [transcribedFile, setTranscribedFile] = useState<TranscribedFile>(null);
  const {
    transcriptionstarted,
    message,
    errorwhiletranscription,
    transcriptioninPercent,
    transcriptionCompleted,
    transcribeDataEndpoint,
  } = useAppContext();
  console.log(transcriptionstarted);
  console.log("is error :", errorwhiletranscription);

  useEffect(() => {
    async function fetchTranscription() {
      if (transcriptionCompleted && transcribeDataEndpoint) {
        try {
          const transcription = await fetch(transcribeDataEndpoint);
          const transcriptionData = await transcription.json();
          console.log(transcriptionData);
          const blob = new Blob([transcriptionData.vtt], { type: "text/vtt" });
          const vttFileUrl = URL.createObjectURL(blob);
          setTranscribedFile({
            url: vttFileUrl,
            ogFilename: transcriptionData.ogFilename,
          });
        } catch (error) {
          console.error(error);
          setTranscribedFile(null);
          notify("Error while fetching transcription", "error");
        }
      }
    }
    fetchTranscription();
  }, [transcriptionCompleted, transcribeDataEndpoint]);

  return (
    <>
      <div>
        {!transcriptionstarted ? (
          <UploadForm />
        ) : !transcribedFile ? (
          <TranscribeInProcess
            error={errorwhiletranscription}
            message={message}
            PercentageDone={transcriptioninPercent}
          />
        ) : (
          <div className="text-center flex flex-col gap-5 justify-center items-center">
            <h5 className="">Here is your transcription of</h5>
            <h2>{transcribedFile.ogFilename}</h2>
            <a
              href={transcribedFile.url}
              download={transcribedFile.ogFilename + ".vtt"}
              className="btn"
            >
              Download Transcription
            </a>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}
