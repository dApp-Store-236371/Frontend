import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IS_ON_ELECTRON } from "../../ElectronCommunication/SharedElectronConstants";
import { PurchasedAppsTable } from "./Components/PurchasedAppsTable";
import "../../CSS/PurchasedPage.css";
import AppData from "../AppsPage/AppData";
import { DEFAULT_EMPTY_APP } from "../../ReactConstants";
import { DownloadAppModal } from "./Components/DownloadAppModal";
import {
  getOwnedApps,
} from "../../Web3Communication/Web3ReactApi";

interface PurchasedProps {
  ownedApps: AppData[];
  setOwnedApps: Dispatch<SetStateAction<AppData[]>>;
  userId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  downloadingApps: AppData[];
  setDownloadingApps: Dispatch<SetStateAction<AppData[]>>;
  downloadPath: string;
}

function PurchasesPage({
  ownedApps,
  setOwnedApps,
  userId,
  isLoading,
  setIsLoading,
  downloadingApps,
  setDownloadingApps,
  downloadPath,
}: PurchasedProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedAppData, setSelectedAppData] =
    useState<AppData>(DEFAULT_EMPTY_APP);
  const toggleShowModal = () => setShowModal(!showModal);

  useEffect(() => {
    let foo = async () => {
      setOwnedApps(await getOwnedApps());
    };
    foo();
  }, [userId]);

  return (
    <>
      <DownloadAppModal />
      <h1 id="purchased-apps-title"> My Purchased Apps</h1>
      <PurchasedAppsTable
        setShowModal={setShowModal}
        setSelectedAppData={setSelectedAppData}
        ownedApps={ownedApps}
        appsToDownload={downloadingApps}
        setAppsToDownload={setDownloadingApps}
        downloadPath={downloadPath}
      />
      ;
    </>
  );

  /*
  if (IS_ON_ELECTRON) {
    return (
      <div>
        <h1>
          The data displayed here is correct, as you couldn't purchase anything
        </h1>
        <>
          {" "}
          <h1> You are running on Electron! </h1>
        </>
      </div>
    );
  } else {
    return (
      <div>
        <h1>
          The data displayed here is correct, as you couldn't purchase anything
        </h1>
      </div>
    );
  }
  */
}

export default PurchasesPage;
