import AppTile from "./AppTile";
import "../../../CSS/AppsCatalogPage.css";
import { Dispatch, SetStateAction } from "react";
import AppData from "../AppData";
import Pagination from "./Pagination";
import { FeaturedAppsTile } from "./FeaturedAppTile";
interface AppsCatalogProps {
  displayedApps: AppData[];
  setDisplayedApps: Dispatch<SetStateAction<AppData[]>>;
  toggleShowModal: any;
  setSelectedAppData: any;
  provider: any;
}
function AppsCatalog(props: AppsCatalogProps) {
  return (
    <>

  <FeaturedAppsTile 
          toggleShowModal={props.toggleShowModal}
          setSelectedAppData={props.setSelectedAppData}
          provider={props.provider}
           />
    <div id="apps-catalog-warpper">
      {props.displayedApps.map((appData) => (
        <AppTile
          key={appData.id}
          appData={appData}
          toggleShowModal={props.toggleShowModal}
          setSelectedAppData={props.setSelectedAppData}
        />
      ))}
      </div>
    </>
  );
}

export default AppsCatalog;
