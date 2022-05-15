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

  return (
    <div className="App">
      <HashRouter>
        <LoginModal
          setIsWalletConnected={setIsWalletConnected}
          setCurrAccount={setCurrAccount}
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
