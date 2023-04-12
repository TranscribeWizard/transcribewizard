
import SocketSingleton from "@/utils/SocetSingleton";
import { HashLoader } from "react-spinners";

type Props = {
  PercentageDone?: number;
  message: string;
  error: boolean;
};

const socket = SocketSingleton.getInstance();


function TranscribeInProcess({ PercentageDone, message, error }: Props) {
  return (
    <>
        <div className="flex flex-col justify-center text-center  items-center gap-3">
          <HashLoader color="#661ae6" />
      {!error ? (
        <>
        <h4>{PercentageDone && PercentageDone + "%"}</h4>
        <h3 className="text-2xl ">{message}</h3>
        </>
        ) : (
          <h3 className="text-2xl text-red-500 ">{message}</h3>
          )}
          </div>
    </>
  );
}

export default TranscribeInProcess;
