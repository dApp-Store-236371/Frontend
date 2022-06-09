import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AppsCatalog from "./Components/AppsCatalog";
import "../../CSS/AppsCatalogPage.css";
import AppData from "./AppData";
import Pagination from "./Components/Pagination";
import { APPS_PER_PAGE, DEFAULT_EMPTY_APP } from "../../ReactConstants";
import AppDetailsModal from "./Components/AppDetailsModal";
import {
  getDisplayedApps,
  getDisplayedAppsObj,
} from "../../Web3Communication/Web3ReactApi";
import { TorrentData } from "../Shared/utils";

interface AppsCatalogPageProps {
  displayedApps: Array<AppData>;
  setDisplayedApps: Dispatch<SetStateAction<Array<AppData>>>;
  numberOfPages: number;
  setNumberOfPages: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  currAccount: string;
  activeTorrents: Array<TorrentData>;
  provider: any;
  downloadPath: string;
}

function AppsCatalogPage(props: AppsCatalogPageProps) {
  const displayedApps = props.displayedApps;
  const setDisplayedApps = props.setDisplayedApps;
  const numberOfPages = props.numberOfPages;
  const setNumberOfPages = props.setNumberOfPages;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedAppData, setSelectedAppData] =
    useState<AppData>(DEFAULT_EMPTY_APP);
  const toggleShowModal = () => setShowModal(!showModal);

  //Display Dummy apps
  useEffect(() => {
    getDisplayedApps(0, APPS_PER_PAGE, setDisplayedApps, setNumberOfPages, );
  }, [props.currAccount]);

  const handlePageClick = (arg: { selected: number }) => {
    console.log("Clicked Page: ", arg.selected);
    getDisplayedApps(
      arg.selected,
      APPS_PER_PAGE,
      setDisplayedApps,
      setNumberOfPages
    );
  };

  return (
    <>
      <AppDetailsModal
        app={selectedAppData}
        showModal={showModal}
        toggleShowModal={toggleShowModal}
        setShowModal={setShowModal}
        isLoading={props.isLoading}
        setIsLoading={props.setIsLoading}
        activeTorrents={props.activeTorrents}
        downloadPath={props.downloadPath}
      />
      <div id="apps-catalog">
        <AppsCatalog
          displayedApps={displayedApps}
          setDisplayedApps={setDisplayedApps}
          toggleShowModal={toggleShowModal}
          setSelectedAppData={setSelectedAppData}
          provider={props.provider}
        />
      </div>
      <div id="pagination-div">
        <Pagination
          handlePageClick={handlePageClick}
          numberOfPages={numberOfPages}
        />
      </div>
    </>
  );
}

export default AppsCatalogPage;
