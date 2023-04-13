"use client";

import { ComboBox } from "../components";
import { useForm } from "react-hook-form";
import { languagesArray, modelsArray } from "@/constants";
import { Toaster, toast } from "react-hot-toast";
import { notify } from "@/utils/notify";
import { redirect } from "next/navigation";
import { useAppContext } from "@/app/contexts/Providers";
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

type UploadResponse =  {
  status: string,
  message: string,
  percentDoneAsNumber?: number,
  percentDone?:string,
  speed?:string,
  timeRemaining?:{
    string: string,
    hoursRemaining: number | string,
    minutesRemaining: string,
    secondsRemaining: string
  },
  transcribeDataEndpoint?: string,
  fileTitle: string,
  transcriptionFolderId?: string,
}

const UploadForm = ({}) => {
  const { register, handleSubmit, control } = useForm<FormData>();
  const {uploadFormForTranscribing}  = useAppContext()

  // const afterUpload =  (transcriptionFolderId: number, sec: number) => {
  //   const transcribeToast = toast.loading("Transcription is in Process...");
  //   setTimeout(() => {
  //     toast.dismiss(transcribeToast);
  //     console.log("Transcription Folder Id: ", transcriptionFolderId);
  //     redirect(`http://localhost:3000/player/${transcriptionFolderId}`)
  //   }, sec * 1000);
  
  // };



  return (
    <div className="rounded-md ">
      <h1 className="text-center text-2xl pb-5 font-bold">Upload Form</h1>
      <form
        onSubmit={handleSubmit(uploadFormForTranscribing)}
        encType="multipart/form-data"
        className="flex flex-col"
      >
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Youtube Video Link</span>
          </label>
          <input
            {...register("ytdlink")}
            type="text"
            placeholder="Paste here"
            className="input-bordered disabled input-primary input w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Upload Your file</span>
          </label>
          <input
            type="file"
            {...register("file")}
            className="file-input-bordered file-input-primary file-input w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Video Language</span>
          </label>
          <ComboBox
            control={control}
            dataArr={languagesArray}
            defaultValue={languagesArray[0]}
            name="language"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Choose A Model</span>
          </label>
          <ComboBox
            control={control}
            dataArr={modelsArray}
            defaultValue={modelsArray[1]}
            name="model"
          />
        </div>
        <input type="submit" value="Transcribe" className="btn my-10" />
      </form>
    </div>
  );
};

export default UploadForm;
