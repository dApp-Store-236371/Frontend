import isElectron from "is-electron";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import AppData from "../AppsPage/AppData";


export async function startDownload(appToDownload: AppData, downloadingApps: AppData[], setDownloadingApps: Dispatch<SetStateAction<AppData[]>>){
    console.log("App to download is: ", appToDownload)
    console.log("Downloading apps: ", downloadingApps)
    if (isElectron() || true) {
        if (downloadingApps.filter(app => app.id === appToDownload.id).length > 0) {
          toast.error("Already downloading this app!");
          console.log(downloadingApps)
          return
        } 

        const toastId = toast.info(`Downloading ${appToDownload.name}...`, {autoClose: false});
        console.log("Toast download id: ", toastId);
        appToDownload.toastDownloadId = toastId;
        setDownloadingApps([...downloadingApps, appToDownload]);
        console.log(downloadingApps)

        //SEND MESSAGE TO ELECTRON

        // Do download
      } 
    else {
        window.open("https://easyupload.io/ihr4mn");
      }
}


