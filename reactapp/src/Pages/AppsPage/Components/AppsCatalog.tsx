import AppTile from "./AppTile";
import "../../../CSS/AppsCatalogPage.css";
import { Dispatch, SetStateAction } from "react";
import AppData from "../AppData";
import Pagination from "./Pagination";
interface AppsCatalogProps {
  displayedApps: AppData[];
  setDisplayedApps: Dispatch<SetStateAction<AppData[]>>;
  toggleShowModal: any;
  setSelectedAppData: any;
}
function AppsCatalog(props: AppsCatalogProps) {
  return (
    <>
      {props.displayedApps.map((appData) => (
        <AppTile
          key={appData.id}
          appData={appData}
          toggleShowModal={props.toggleShowModal}
          setSelectedAppData={props.setSelectedAppData}
        />
      ))}
    </>
  );
}

export default AppsCatalog;
