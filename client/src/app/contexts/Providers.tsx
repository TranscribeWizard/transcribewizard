"use client";

import { notify } from "@/utils/notify";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";
const l = console.log;

const appContext = createContext<StateProps>({});

type Props = {
  children?: React.ReactNode;
};

type StateProps = {
  uploadFormForTranscribing: (fdata: FormData) => Promise<void>;
  UploadResponse: UploadResponse;
  transcriptionstarted: boolean;
  message: string;
  transcriptioninPercent: number;
  errorwhiletranscription: boolean;
  transcriptionDownloadData:{
    url: string;
    ogFilename: string;
  } | null
};

type ModelAndLang = {
  name: string;
  value: string;
};

type FormData = {
  file: File[];
  language: ModelAndLang;
  model: ModelAndLang;
  ytdlink: string;
};

type UploadResponse = {
  success: boolean;
  status?: string;
  estTimeInSec?: number;
  message: string;
  hint?: string;
  percentDoneAsNumber?: number;
  timeRemaining?: {
    string: string;
    hoursRemaining: number | string;
    minutesRemaining: string;
    secondsRemaining: string;
  };
  transcribeDataEndpoint?: string;
  fileTitle?: string;
  transcriptionFolderId?: string;
};


  



export const Provider = ({ children }: Props) => {
  const [transcriptionstarted, setTranscriptionstarted] = useState(false);
  const [transcriptioninPercent, setTranscriptioninPercent] = useState(0);
  const [errorwhiletranscription, seterrorwhiletranscription] = useState(false);
  const [transcriptionDownloadData, settranscriptionDownloadData] = useState(null);
  const [message, setMessage] = useState("");
  const [UploadResponse, setUploadResponse] = useState<UploadResponse>({} as UploadResponse);

  const uploadFormForTranscribing = async (fdata: FormData) => {
    const { file, language, model, ytdlink } = fdata;

    if (!file[0] && !ytdlink) {
      return notify("Provide a file or a link for transcribing", "error");
    }

    if (file[0] && ytdlink) {
      return notify("Provide only one thing a link or a file", "error");
    }

    const uploadingToast = toast.loading("Ulpoading...");

    const formData = new FormData();
    formData.append("file", file[0] as Blob);
    formData.append("language", language.value);
    formData.append("model", model.value);
    formData.append("ytdlink", ytdlink);

    try {
      const res = await fetch("http://localhost:5001/api/v1/transcribe", {
        method: "POST",
        body: formData,
      });

      const resData: UploadResponse = await res.json();

      if (!res.ok) {
        toast.dismiss(uploadingToast);
        notify(resData.message, "error");
        return;
      }

      const {
        success,
        message,
        transcribeDataEndpoint,
        fileTitle,
        estTimeInSec,
        transcriptionFolderId,
      } = resData;

      if (!success) {
        toast.dismiss(uploadingToast);
        notify(message, "error");
        return;
      }
      toast.dismiss(uploadingToast);
      notify(message, "success");
      setUploadResponse(resData);
      setMessage(resData.message);
      setTranscriptionstarted(true);
      // await afterUpload(transcribeDataEndpoint as string, estTimeInSec as number);
      

      l(resData);
    } catch (error) {
      toast.dismiss(uploadingToast);
      l("Error: ", error);
      notify("something went wrong", "error");
    }
  };



  // const afterUpload = async (transcribeDataEndpoint: string, sec: number) => {
  //   try {
  //     const interval = setInterval(async () => {
  //       const response = await fetch(transcribeDataEndpoint);
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch transcription: ${response.statusText}`);
  //       }
  //       const data = await response.json();
  //       if (data.status === "completed") {
  //         const blob = new Blob([data.vtt], { type: "text/vtt" });
  //         const url = URL.createObjectURL(blob);
  //         settranscriptionDownloadData({url, ogFilename: data.ogFilename});
  //         clearInterval(interval);
  //       } else if (data.status === "progress") {
  //         setTranscriptioninPercent(data.percentDoneAsNumber);
  //         setMessage(data.message);
  //       } else {
  //         console.log(data);
  //         seterrorwhiletranscription(true);
  //         setMessage(data.message);
  //         clearInterval(interval);
  //         throw new Error(data.message);
  //       }
  //     })
  //   } catch (error) {
  //     console.error(error);
  //     seterrorwhiletranscription(true);
  //     setMessage(error.message);
  //     clearInterval(interval);
  //   }
  // };
  
  const state: StateProps = {
    uploadFormForTranscribing,
    UploadResponse,
    transcriptionstarted,
    message,
    transcriptioninPercent,
    errorwhiletranscription,
    transcriptionDownloadData,
  };
  return (
    <appContext.Provider value={state}>
      <SessionProvider>{children}</SessionProvider>
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
