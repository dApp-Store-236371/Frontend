import isElectron from "is-electron";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import ElectronMessages from "../../ElectronCommunication/ElectronMessages";
import { IS_ON_ELECTRON } from "../../ElectronCommunication/SharedElectronConstants";
import { AppRatings } from "../../ReactConstants";
import AppData from "../AppsPage/AppData";


export async function startDownload(appToDownload: AppData, downloadingApps: AppData[], setDownloadingApps: Dispatch<SetStateAction<AppData[]>>, downloadPath: string){
    console.log("App to download is: ", appToDownload)
    console.log("Downloading apps: ", downloadingApps)
    if (isElectron()) {
        // if (downloadingApps.filter(app => app.id === appToDownload.id).length > 0) {
        //   toast.error("Already downloading this app!");
        //   console.log(downloadingApps)
        //   return
        // }
        if (appToDownload.magnetLink === "" || appToDownload.magnetLink === undefined) {
          toast.error("No magnet link found for this app!");
          return
        }


        const toastId = toast.info(`Downloading ${appToDownload.name}...`, {autoClose: false});
        console.log("Toast download id: ", toastId);
        appToDownload.toastDownloadId = toastId;
        setDownloadingApps([...downloadingApps, appToDownload]);
        console.log(downloadingApps)

        //SEND MESSAGE TO ELECTRON

        const { ipcRenderer } = window.require("electron");
        console.log("Before ipcRenderer")
  
        const res = await ipcRenderer.invoke(ElectronMessages.ElectronMessages.DOWNLOAD_TORRENT, JSON.stringify({ magnet: appToDownload.magnetLink, path: downloadPath }));
        if(!res.success){
          toast.update(toastId, {
            render: `Error downloading ${appToDownload.name}!  ${res.errorMsg}`,
            type: toast.TYPE.ERROR,
            autoClose: 5000
          })
          setDownloadingApps(downloadingApps.filter(app => app.id !== appToDownload.id));
        }
          
      } 
    else {
        window.open("https://easyupload.io/ihr4mn");
      }
}


export async function createMagnetLink(path: string){
  
  if (IS_ON_ELECTRON) {
    console.log("Creating magnet link")

      const { ipcRenderer } = window.require("electron");
      console.log("Before ipcRenderer")

      let electronRes = await ipcRenderer
        .invoke(ElectronMessages.ElectronMessages.CREATE_MAGNET, JSON.stringify({ path: path }))
        .then((result: any) => {
          console.log("createMagnet reply:", result);
          if (!result.success) {
            console.log("Error creating magnet link");
            throw new Error(result.errorMsg);
          }

          return result
        });
      return [electronRes.magnet, electronRes.sha]
    

  }
  else{
    console.log("Returning empty magnet")
    return ["", "EMPTY SHA"]
  }
}


export function ratingEnumToNumber(rating: AppRatings){
  switch(rating){
    case AppRatings.One:
      return 1
    case AppRatings.Two:
      return 2
    case AppRatings.Three:
      return 3
    case AppRatings.Four:
      return 4
    case AppRatings.Five:
      return 5
    default:
      return 0
  }
}

export async function requestSeed(app: AppData){
  if (IS_ON_ELECTRON) {
    console.log("Requesting seed, ", app, app.SHA)

      const { ipcRenderer } = window.require("electron");
      console.log("Before ipcRenderer")

      let electronRes = await ipcRenderer
        .invoke(ElectronMessages.ElectronMessages.SEED_TORRENT , JSON.stringify({ magnet: app.magnetLink, name: app.name, sha: app.SHA.slice(-1)[0]  }))
        .then((result: any) => {
          console.log("requestSeed reply:", result);
          if (!result.success) {
            console.log("Error requesting seed");
            throw new Error(result.errorMsg);
          }
          return result
        });
      return electronRes
    

  }
  else{
    console.log("Returning empty magnet")
    return {success:false, errorMsg: "Use Desktop App"}
  }
}
