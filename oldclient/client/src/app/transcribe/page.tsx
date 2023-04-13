import { Navbar } from "./components";
import {UploadForm} from "./container";

export default function Transcribe() {
    return (
        <>
       <Navbar />
       <main className="flex min-h-screen md:px-24 px-10  justify-center items-center ">
         <UploadForm />
       </main>
        </>
      );
}