import isElectron from "is-electron";
import { MDBBtn } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import { destroyAllTorrents, TorrentData } from "../Shared/utils";
import { StatusTable } from "./StatusTable";

interface StatusPageProps {
    activeTorrents: TorrentData[];
}


export function StatusPage(props: StatusPageProps) {
    console.log("Status page got apps: ", props.activeTorrents);
    
  // if(!isElectron()){
  //   return <h1>This page is only available on our de</h1>
  // }

  return (
    <>
  

      <div>
          <StatusTable activeTorrents={props.activeTorrents} />
        </div>
         
      <MDBBtn style={{
        "margin": "10px",

      }}onClick={async () => { 
        //send destoryall message to electron
        destroyAllTorrents().then(() => {
          toast.success("All torrents destroyed 🎉 ")
        })
        .catch((err) => {
          toast.error("Error destroying torrents: " + err)
        })
         }}>
        Remove All
      </MDBBtn>
      </>
     
  );
}