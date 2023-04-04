import { SignInBtn } from "@/components";
import { type NextPage } from "next";

const Register = ({}) => {
  return (
    <div className="flex flex-col items-center  gap-5">
      <h1 className="text-5xl font-semibold ">TranscribeWizard</h1>
      <p className="text-center">
        Learn Languages Through Coversations <br /> With Personalized{" "}
        <span className="text-2xl">Ai</span>{" "}
      </p>
      <SignInBtn />
    </div>
  );
};

export default Register;
