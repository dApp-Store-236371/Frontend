import isElectron from "is-electron";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import ElectronMessages from "../../ElectronCommunication/ElectronMessages";
import { IS_ON_ELECTRON } from "../../ElectronCommunication/SharedElectronConstants";
import { AppRatings } from "../../ReactConstants";
import AppData from "../AppsPage/AppData";


export async function startDownload(appToDownload: AppData, downloadPath: string){
    console.log("App to download is: ", appToDownload)
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

        //SEND MESSAGE TO ELECTRON

        const { ipcRenderer } = window.require("electron");
        console.log("Before ipcRenderer")
  
        const res = await ipcRenderer.invoke(ElectronMessages.ElectronMessages.DOWNLOAD_TORRENT, JSON.stringify({ magnet: appToDownload.magnetLink, path: downloadPath, sha: appToDownload.SHA, appId: appToDownload.id  }));
        if(!res.success){
          toast.update(toastId, {
            render: `Error downloading ${appToDownload.name}!  ${res.errorMsg}`,
            type: toast.TYPE.ERROR,
            autoClose: 5000
          })
        }
          
      } 
    else {
        window.open("https://easyupload.io/ihr4mn");
      }
}


export async function createMagnetLink(path?: string){
  
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
    throw new Error("Error generating magnet link")
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

export async function updateElectronAppId(id: number, magnet: string){
  if (IS_ON_ELECTRON) {
    console.log("Updating electron app id")
try{
    const { ipcRenderer } = window.require("electron");
    console.log("updateElectronAppId Before ipcRenderer")
    
    await ipcRenderer.invoke(ElectronMessages.ElectronMessages.UPDATE_APP_ID , JSON.stringify({  appId: id, magnet: magnet }));

    
  }
  catch(err){
    console.error("Error updating electron app id: ", id, magnet, err)
  }
}

}


export async function requestSeed(app: AppData){
  if (IS_ON_ELECTRON) {
    console.log("Requesting seed, ", app, app.SHA)

      const { ipcRenderer } = window.require("electron");
      console.log("Before ipcRenderer")

      let electronRes = await ipcRenderer
        .invoke(ElectronMessages.ElectronMessages.SEED_TORRENT , JSON.stringify({ magnet: app.magnetLink, name: app.name, sha: app.SHA, appId: app.id }))
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

export async function getActiveTorrentData() :Promise<TorrentData[]>{
  if (IS_ON_ELECTRON) {
    console.log("Getting active torrent data")

      const { ipcRenderer } = window.require("electron");
      console.log("Before ipcRenderer")

      let activeTorrents: TorrentData[]= await ipcRenderer
        .invoke(ElectronMessages.ElectronMessages.GET_ACTIVE_TORRENT_DATA)
        .then((activeTorrents: any) => {
          console.log("getActiveTorrentData reply:", activeTorrents);
          const res = []
          for(let rawTorrentData of activeTorrents){
            const torrentData: TorrentData = {
              name: rawTorrentData.name,
              progress: rawTorrentData.progress,
              downloadSpeed: rawTorrentData.downloadSpeed,
              uploadSpeed: rawTorrentData.uploadSpeed,
              magnet: rawTorrentData.magnet,
              peersNum: rawTorrentData.peersNum,
              path: rawTorrentData.path,
              appId: rawTorrentData.appId,
            }

       

            res.push(torrentData)
          }
          return res
        });
      return activeTorrents
    

  }
  else{
    return []
  }
}


export interface TorrentData {
  magnet?: string,
  name?: string,
  progress?: number,
  downloadSpeed?: number,
  uploadSpeed?: number,
  totalSize?: number,
  path?: string,
  isActive?: boolean,
  peersNum?: number,
  appName?: string,
  appId?: number,
  sha?: string
}

// export type AppDataWithTorrent = AppData & TorrentData;

export async function checkImage(url: string|undefined){
  if(url===undefined){
    console.log("No image found")
   return false
 }
  const res = await  new Promise((resolve) => {
      const img = new Image();

      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  return res

//   console.log("Checking image: ", url)
//   try{
//   const res = await fetch(url);
//   console.log("fetchedRes: ", res)
//   const buff = await res.blob();
//   console.log("BUFF: ", buff)
//   return buff.type.startsWith('image/')
//  }
//   catch(e: any){
//     console.log("Error checking image: ", e.message)
    
//     return false
//   }

} 