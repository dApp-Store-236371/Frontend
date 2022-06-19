import isElectron from "is-electron";
import { TorrentData } from "../Shared/utils";
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
    <div>
      <StatusTable activeTorrents={props.activeTorrents}/>
    </div>
  );
}