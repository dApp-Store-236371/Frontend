import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IS_ON_ELECTRON } from "../../ElectronCommunication/SharedElectronConstants";
import { PublishedAppsTable } from "./Components/PublishedAppsTable";
import AppData from "../AppsPage/AppData";
import {
  getPublishedApps,
} from "../../Web3Communication/Web3ReactApi";
import "../../CSS/PublishedPage.css";
import UpdateAppModal from "./Components/UpdateAppModal";
import { DEFAULT_EMPTY_APP } from "../../ReactConstants";
interface PublishedProps {
  publishedApps: AppData[];
  setPublishedApps: Dispatch<SetStateAction<AppData[]>>;
  accountId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  isUploading: boolean;
}

function PublishedPage({
  publishedApps,
  setPublishedApps,
  accountId,
  isLoading,
  setIsLoading,
  setIsUploading,
  isUploading,
}: PublishedProps) {
  useEffect(() => {
    let foo = async () => {
      const newPublishedApps = await getPublishedApps()
      console.log('WW: newPublishedApps', newPublishedApps)
      setPublishedApps(newPublishedApps);
    };
    foo();
  }, [accountId]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedAppData, setSelectedAppData] =
    useState<AppData>(DEFAULT_EMPTY_APP);
  const toggleShowModal = () => setShowModal(!showModal);

  return (
    <>
      <UpdateAppModal
        appToUpdate={selectedAppData}
        showModal={showModal}
        setShowModal={setShowModal}
        toggleShowModal={toggleShowModal}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setIsUploading={setIsUploading}
        isUploading={isUploading}
      />
      <h1 id="published-apps-title"> My Published Apps</h1>
      <PublishedAppsTable
        publishedApps={publishedApps}
        setSelectedAppData={setSelectedAppData}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default PublishedPage;
