import { Navbar } from "@/components";
import { UploadForm } from "@/containers";
import {type NextPage } from "next";




const page:NextPage = ({}) => {
  return (
    <>
   <Navbar />
   <main className="flex min-h-screen px-24 justify-end items-center ">
     <UploadForm />
   </main>
    </>
  );
};

export default page;