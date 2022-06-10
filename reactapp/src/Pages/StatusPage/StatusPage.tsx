import { TorrentData } from "../Shared/utils";
import { StatusTable } from "./StatusTable";

interface StatusPageProps {
    activeTorrents: TorrentData[];
}


export function StatusPage(props: StatusPageProps) {
    console.log("Status page got apps: ", props.activeTorrents);
  return (
    <div>
      <StatusTable activeTorrents={props.activeTorrents}/>
    </div>
  );
}