"use client";

import { useAppContext } from "@/app/contexts/Providers";
import UploadForm from "./UploadForm";
import { Toaster } from "react-hot-toast";
import TranscribeInProcess from "./TranscribeInProcess";

export default function TranscribeWrapper() {
  const {
    transcriptionstarted,
    message,
    errorwhiletranscription,
    transcriptionDownloadData,
    transcriptioninPercent,
  } = useAppContext();
  console.log(transcriptionstarted);
  console.log('is error :', errorwhiletranscription);
  return (
    <>
      <div>
        {!transcriptionstarted ? (
          <UploadForm />
        ) : !transcriptionDownloadData ? (
          <TranscribeInProcess
            error={errorwhiletranscription}
            message={message}
            PercentageDone={transcriptioninPercent}
          />
        ) : (
          <div>
            <a
              href={transcriptionDownloadData.url}
              download={transcriptionDownloadData.ogFilename + ".vtt"}
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
