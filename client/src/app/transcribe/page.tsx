import { Navbar } from "./components";
import { Provider } from "@/app/contexts/Providers";


import {TranscribeWrapper} from "./container";
import SocketSingleton from "@/utils/SocetSingleton";

export default function Transcribe() {
  const socket = SocketSingleton.getInstance();

  
  socket.addEventListener('message', (event) => {
    console.log(`WebSocket received message: ${event.data}`);
  });

    return (
        <div className="bg-base-300">
       <Navbar />
       <main className="flex min-h-screen md:px-24 px-10   justify-center items-center ">
       <Provider>
       <TranscribeWrapper />
       </Provider>
       </main>
        </div>
      );
}