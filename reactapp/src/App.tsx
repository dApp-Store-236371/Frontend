import React, { useEffect, useState } from "react";
import PurchasesPage from "./Pages/PurchasesPage/PurchasesPage";
import AppsCatalogPage from "./Pages/AppsPage/AppsCatalogPage";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import isElectron from "is-electron";
import { ElectronMessages } from "./ElectronCommunication/ElectronMessages";
import NavigationBar from "./Pages/Shared/NavigationBar";
import Footer from "./Pages/Shared/Footer";
import SideNav from "./Pages/Shared/SideNav";
import { IS_ON_ELECTRON } from "./ElectronCommunication/SharedElectronConstants";
import UploadPage from "./Pages/UploadPage/UploadPage";
import {AppCategories, PagePaths} from "./ReactConstants";
import AppData from "./Pages/AppsPage/AppData";
import PublishedPage from "./Pages/MyPublishedPage/PublishedPage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { LoginModal } from "./Pages/LoginPage/LoginModal";

import Web3 from "web3";
import { Web3TestPage } from "./Web3Communication/Web3TestPage";
import { uploadDummyApps } from "./Web3Communication/Web3ReactApi";
import { web3 } from "./Web3Communication/Web3Init";
import { SettingsModal } from "./Pages/Shared/SettingsModal";
toast.configure();

console.log("Is running on Electron? " + isElectron());

const handleDemoClick = () => {
  if (IS_ON_ELECTRON) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("alert", JSON.stringify({}));
    console.log(res);
  }
  console.log("button clicked");
};

const handleDemoClickAsync = () => {
  if (IS_ON_ELECTRON) {
    const { ipcRenderer } = window.require("electron");

    ipcRenderer
      .invoke(ElectronMessages.ECHO_MSG, JSON.stringify({ payload: "HI" }))
      .then((result: any) => {
        console.log("invoke reply:" + result);
      });
  }
  console.log("button clicked");
};

function App() {
  localStorage.clear(); //Keeps WalletConnect from caching the data. More granularity may be required.
  const [displayedApps, setDisplayedApps] = useState<Array<AppData>>([]);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [publishedApps, setPublishedApps] = useState<AppData[]>([]);
  const [ownedApps, setOwnedApps] = useState<AppData[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currAccount, setCurrAccount] = useState<string>("");
  const [provider, setProvider] = useState<any>(undefined);
  const [downloadingApps, setDownloadingApps] = useState<AppData[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [defaultPath, setDefaultPath] = useState<string>("C:\\daapstoreDownloads");
  

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');
      web3.eth.getAccounts().then((accounts) => {
        setIsWalletConnected(accounts.length > 0);
        console.log("Accounts: ", accounts);
        setCurrAccount(accounts[0]);
      })    
      .catch((error) => {
        console.log(error);
      });
      }, 3000)
    


    return () => clearInterval(interval);
  }, []);

  if(isElectron()){
    const { ipcRenderer } = window.require("electron");
    console.log("DEBUG Awaiting Electron state updates")
    ipcRenderer.on("download-progress-update", (event:any, arg:any) => {
      console.log("DEBUG RECEIVED ELECTRON DOWNLOAD UPDATE")
      const appId = arg.appId;
      const progress = arg.progress;
      updateDownloadProgress(appId, progress);
    });
  }

  async function updateDownloadProgress(appId: AppData, progress: number, ){
    if (isElectron() || true) {
      const tmp = downloadingApps.filter(app => app.id === appId.id)
      if(tmp.length > 0){
        const toastId = tmp[0].toastDownloadId;
        toast.update(toastId, {
          render: `Downloading ${appId.name}... ${progress}%`,
          type: toast.TYPE.INFO,
          autoClose: false
        })
      }
    }
}

  return (
    <div className="App">
      <HashRouter>
        <LoginModal
          setIsWalletConnected={setIsWalletConnected}
          setCurrAccount={setCurrAccount}
          isWalletConnected={isWalletConnected}
          provider={provider}
          setProvider={setProvider}
        />
        <SettingsModal
              setDefaultPath={setDefaultPath}
              defaultPath={defaultPath}
              currAccount={currAccount}
              showModal={showSettingsModal}
              setShowModal={setShowSettingsModal}
        />
        <button
          onClick={() => {
            uploadDummyApps(30);
          }}
        >
          Upload 30 Dummy Apps
        </button>
        <SideNav />
        <NavigationBar
          setNumberOfPages={setNumberOfPages}
          setDisplayedApps={setDisplayedApps}
          currAccount={currAccount}
          setShowSettingsModal={setShowSettingsModal}
        />
        <Routes>
          <Route
            path={PagePaths.AppsPagePath}
            element={
              <AppsCatalogPage
                displayedApps={displayedApps}
                numberOfPages={numberOfPages}
                setNumberOfPages={setNumberOfPages}
                setDisplayedApps={setDisplayedApps}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                currAccount={currAccount}
                downloadingApps={downloadingApps}
                setDownloadingApps={setDownloadingApps}
                provider={provider}
                downloadPath={defaultPath}

              />
            }
          />
          <Route
            path={PagePaths.PurchasesPagePath}
            element={
              isWalletConnected ? (
                <PurchasesPage
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  userId={userId}
                  ownedApps={ownedApps}
                  setOwnedApps={setOwnedApps}
                  downloadingApps={downloadingApps}
                  setDownloadingApps={setDownloadingApps}
                  downloadPath={defaultPath}
                />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path={PagePaths.UploadPagePath}
            element={
              isWalletConnected ? (
                <UploadPage
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route path={PagePaths.NotFoundPagePath} element={<ErrorPage />} />
          <Route path={"/web3test"} element={<Web3TestPage />} />
          <Route path={PagePaths.LoginPagePath} element={<LoginPage />} />
          <Route
            path={PagePaths.MyPublishedPagePath}
            element={
              <PublishedPage
                publishedApps={publishedApps}
                setPublishedApps={setPublishedApps}
                userId={userId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setIsUploading={setIsUploading}
                isUploading={isUploading}
              />
            }
          />
        </Routes>
        {/*Prevents footer to hide content */}
        <div
          className="clear"
          style={{ clear: "both", height: "60px" }}
        ></div>{" "}
        <Footer />
      </HashRouter>
    </div>
    /*
<Route path={"/debug"} element={<AppDetailsModal />} />
 */

    /*
    if(isOnElectron){
        return (
            <div>
                <h1>Hello! Welcome to the homepage!</h1>
                 <h1> You are running on Electron! </h1>
                <button onClick={handleDemoClick}> Show Error Box Synchronous</button>
                <button onClick={handleDemoClickAsync}> Show Error Box Async</button>

            </div>
        )
    }

  return (
      <div className="App">
      <BrowserRouter >
          <Routes>
              <Route path="/" element={<PurchasesPage />} />
              <Route path="*" element={<ErrorPage />} />
          </Routes>
      </BrowserRouter>
      </div>
  */
  );
}

export default App;
