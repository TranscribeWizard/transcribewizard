import { toast } from "react-hot-toast";


export const notify = (message:string,type:string) => {
    switch (type) {
      case "success":
        toast.success(message, {
          icon: "✅",
          className: "bg-base-300 dark:text-white",
        })  
        break;
      case "error":
        toast.error(message, {
          icon: "❌",
          className: "bg-base-300 dark:text-white",
        })
        break;
      case "info":
        toast(message,{
          icon:"❓",
          className:"bg-base-300 dark:text-white",
        })
      break;
    }
  }
