import { IS_ON_ELECTRON } from "./ElectronCommunication/SharedElectronConstants";
import { ElectronMessages } from "./ElectronCommunication/ElectronMessages";


export function foo ()
{
  return 0
}

// export async function createMagnetLink(path){
//   let magnetLink = ""
//
//   if (IS_ON_ELECTRON) {
//     console.log("Creating magnet link")
//
//     const { ipcRenderer } = window.require("electron");
//     const res = ipcRenderer.sendSync("createMagnet", JSON.stringify({"path": path}));
//     console.log(res);
//     if (IS_ON_ELECTRON) {
//       const { ipcRenderer } = window.require("electron");
//
//        magnetLink = await ipcRenderer
//         .invoke("createMagnet", JSON.stringify({ path: path }))
//         .then((result) => {
//           console.log("createMagnet reply:" + result);
//
//           return result
//         });
//       return magnetLink
//     }
//
//   }
//   return magnetLink

//}
