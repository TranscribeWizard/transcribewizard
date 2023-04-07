"use client";

import { ComboBox } from "@/components";
import { useForm } from "react-hook-form";
import { languagesArray, modelsArray } from "@/constants/constants";
import { Toaster, toast } from "react-hot-toast";
import { notify } from "../utils/notify";
import { redirect } from "next/navigation";

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
  message: string;
  estTimeInSec: number;
  transcribeDataEndpoint: string;
  fileTitle: string;
  transcriptionFolderId: number;
};

const UploadForm = ({}) => {
  const { register, handleSubmit, control } = useForm<FormData>();

  const onsubmit = async (fdata: FormData) => {
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

      if (res.ok) {
        toast.dismiss(uploadingToast);
        notify("File uploaded successfully", "success");
        afterUpload(resData.transcriptionFolderId, resData.estTimeInSec);

      } else {
        toast.dismiss(uploadingToast);
        notify(resData.message, "error");
      
      }

    } catch (error) {
      toast.dismiss(uploadingToast);
      console.log("Error: ", error);
      notify("something went wrong", "error");
    }
  };

  const afterUpload =  (transcriptionFolderId: number, sec: number) => {
    const transcribeToast = toast.loading("Transcription is in Process...");
    setTimeout(() => {
      toast.dismiss(transcribeToast);
      console.log("Transcription Folder Id: ", transcriptionFolderId);
      redirect(`http://localhost:3000/player/${transcriptionFolderId}`)
    }, sec * 1000);
  
  };



  return (
    <div className="rounded-md bg-base-300">
      <Toaster />

      <h1 className="text-center text-2xl font-bold">Upload Form</h1>
      <form
        onSubmit={handleSubmit(onsubmit)}
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
