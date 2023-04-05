"use client";

import { ComboBox } from "@/components";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { languagesArray, modelsArray } from "@/constants/constants";
import { Toaster, toast } from "react-hot-toast";
import { notify } from "../utils/notify";



type ModelAndLang = {
  name: string,
  value: string
}

type FormData = {
  file: File[];
  language: ModelAndLang;
  model: ModelAndLang;
  ytdlink: string;
}

const UploadForm = ({}) => {
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const { register, handleSubmit, control } = useForm();

  const onsubmit = async (fdata: FormData) => {
    const { file, language, model, ytdlink } = fdata;
    // console.log(file, language, model, ytdlink);
    if (!file[0] && !ytdlink  ) {
     return notify("Provide a file or a link for transcribing", "error");
    }

    if (file[0] && ytdlink) {
      return notify("Provide only one thing a link or a file", "error");
    }

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
      const resData = await res.json()
     if(!res.ok){
       notify(resData.message, "error");
     }
     else{
       notify("File uploaded successfully",'success');
     }
    } catch (error: any) {
      console.log('Error: ',error);
      notify("something went wrong", "error");
    }
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
            className="input-bordered input-primary input w-full max-w-xs"
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
            defaultValue={modelsArray[3]}
            name="model"
          />
        </div>
        <button type="submit" className="btn my-10">
          Transcribe
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
