"use client"

import { ComboBox } from "@/components";
import { type NextPage } from "next";
import {type User } from "next-auth";
import { useSession } from "next-auth/react";
import {useState} from 'react'
import { useForm } from "react-hook-form";
import {languagesArray, modelsArray} from '@/constants/constants'

const UploadForm = ({}) => {
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const { register, handleSubmit, control } = useForm();
  const { data } = useSession();
  console.log(data);
  const user = data?.user as User;

  const onsubmit = (fdata) =>{
    console.log(fdata);
  }

  return (
    <div className="rounded-md bg-base-300">
      <h1 className="text-center text-2xl font-bold">Upload Form</h1>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col">
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
          <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Video Language</span>
          </label>
          <ComboBox control={control} dataArr={languagesArray} defaultValue={languagesArray[0]}  name="language" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Choose A Model</span>
          </label>
          <ComboBox control={control} dataArr={modelsArray} defaultValue={modelsArray[5]}  name="model" />
        </div>
        <button type="submit" className="btn my-10">Transcribe</button>
      </form>
    </div>
  );
};

export default UploadForm;
