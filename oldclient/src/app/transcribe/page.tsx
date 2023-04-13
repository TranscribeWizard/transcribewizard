import { Navbar } from "@/components";
import { UploadForm } from "@/containers";





const Page = ({}) => {
  // const socket = io("ws://localhost:5001");
  return (
    <>
   <Navbar />
   <main className="flex min-h-screen md:px-24 px-10  justify-center items-center ">
     <UploadForm />
   </main>
    </>
  );
};

export default Page;
