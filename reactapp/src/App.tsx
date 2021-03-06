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
import {AppCategories, AppRatings, DEFAULT_DOWNLOAD_PATH, PagePaths} from "./ReactConstants";
import AppData from "./Pages/AppsPage/AppData";
import PublishedPage from "./Pages/MyPublishedPage/PublishedPage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { LoginModal } from "./Pages/LoginPage/LoginModal";

import Web3 from "web3";
import { Web3TestPage } from "./Web3Communication/Web3TestPage";
import { getFeaturedApp, getOwnedApps, uploadDummyApps } from "./Web3Communication/Web3ReactApi";
import { web3 } from "./Web3Communication/Web3Init";
import { SettingsModal } from "./Pages/Shared/SettingsModal";
import { StatusPage } from "./Pages/StatusPage/StatusPage";
import { getActiveTorrentData, TorrentData } from "./Pages/Shared/utils";
toast.configure();

console.log("Is running on Electron? " + isElectron());

// const handleDemoClick = () => {
//   if (IS_ON_ELECTRON) {
//     const { ipcRenderer } = window.require("electron");
//     const res = ipcRenderer.sendSync("alert", JSON.stringify({}));
//     console.log(res);
//   }
//   console.log("button clicked");
// };

// const handleDemoClickAsync = () => {
//   if (IS_ON_ELECTRON) {
//     const { ipcRenderer } = window.require("electron");

//     ipcRenderer
//       .invoke(ElectronMessages.ECHO_MSG, JSON.stringify({ payload: "HI" }))
//       .then((result: any) => {
//         console.log("invoke reply:" + result);
//       });
//   }
//   console.log("button clicked");
// };

function App() {
  localStorage.clear(); //Keeps WalletConnect from caching the data. More granularity may be required.
  const [displayedApps, setDisplayedApps] = useState<Array<AppData>>([]);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [publishedApps, setPublishedApps] = useState<AppData[]>([]);
  const [ownedApps, setOwnedApps] = useState<AppData[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currAccount, setCurrAccount] = useState<string>("");
  const [provider, setProvider] = useState<any>(undefined);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [defaultPath, setDefaultPath] = useState<string>(DEFAULT_DOWNLOAD_PATH);

  const [activeTorrents, setActiveTorrents] = useState<TorrentData[]>([]);

  const [featuredApp, setFeaturedApp] = useState<AppData | undefined >(undefined);
  const [useServer, setUseServer] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(AppCategories.All)
  const [selectedRating, setSelectedRating] = useState<AppRatings>(AppRatings.All)
    
  useEffect( () => {
      console.log("provider changed")
      const updateFeaturedApp = async () => {
          const newFeaturedApp = await getFeaturedApp();
          setFeaturedApp(newFeaturedApp);

      }

      updateFeaturedApp();


  }, [provider])

  // useEffect(() => {
  //   let foo = async () => {
  //     setOwnedApps(await getOwnedApps());
  //   };
  //   foo();
  // }, [currAccount]);

  //update electron about account change
  useEffect(() => {
    console.log("Changed currAccount to " + currAccount);
    if (isElectron()) {
      const { ipcRenderer } = window.require("electron");
      console.log("Sending currAccount to electron");
      ipcRenderer.invoke(ElectronMessages.ACCOUNT_ID_UPDATE, JSON.stringify({currAccount: currAccount}));

    }}, [currAccount]);

  //refresh torrent data
  async function refreshActiveTorrentData(){
    try{
        if(isElectron()) {
          let activeTorrentsData: TorrentData[] = await getActiveTorrentData();
          console.debug("Active torrents data Received: ",activeTorrentsData);
         // setOwnedApps(await getOwnedApps());
         const myApps: AppData[] = await getOwnedApps()
          activeTorrentsData = activeTorrentsData.map(torrentData => {
             console.debug("refreshActiveTorrentData my apps: " + JSON.stringify(myApps)+" aaa", myApps);

            // console.log("\n refreshActiveTorrentData torrentData: " + JSON.stringify(torrentData)+"\n");
            //let appData: AppData|undefined = myApps.find(app => app.magnetLink === torrentData.magnet);
            let appData = myApps.find(app => app.magnetLink === torrentData.magnet);
            if(torrentData.appId !== undefined){
              console.log("refreshActiveTorrentData appId is not undefined")
              // appData = myApps.find(app => app.id === torrentData.appId);
            }

            if (appData === undefined &&  torrentData.sha !== undefined) {
              console.debug("refreshActiveTorrentData is using SHA ", torrentData.sha)
              appData = myApps.find(app => app.SHA[-1] === torrentData.sha);
            }

            if(appData !== undefined){
              console.debug("refreshActiveTorrentDataFound app data for torrent: " + appData.name + torrentData.magnet, "id is " + appData.id)
              torrentData.appName = appData.name;
              torrentData.appId = appData.id;
            }
            else{
              torrentData.appName = undefined;
              torrentData.appId = undefined;
            }
            return torrentData;
          })
          //console.warn("refreshActiveTorrentData returning activeTorrentsData: ", activeTorrentsData);
          setActiveTorrents(activeTorrentsData);
        }
        
      }
      catch(e){
        console.error("ERROR refreshActiveTorrentData: ", e);
      }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refreshActiveTorrentData()

      
      }, 3000)
    


    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');
      web3.eth.getAccounts().then((accounts) => {
        setIsWalletConnected(accounts.length > 0);
        // console.log("Accounts: ", accounts);
        setCurrAccount(accounts[0]);
      })    
      .catch((error) => {
        console.log(error);
      });
      }, 3000)
    


    return () => clearInterval(interval);
  }, []);

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
              setUseServer={setUseServer}
              useServer={useServer}
        />
        {/* <button
          onClick={() => {
            uploadDummyApps(30);
          }}
        >
          Upload 30 Dummy Apps
        </button> */}
        <SideNav />
        <NavigationBar
          setNumberOfPages={setNumberOfPages}
          setDisplayedApps={setDisplayedApps}
          currAccount={currAccount}
          setShowSettingsModal={setShowSettingsModal}
          useServer={useServer}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
  
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
                activeTorrents={activeTorrents}
                provider={provider}
                downloadPath={defaultPath}
                featuredApp={featuredApp}
                useServer={useServer}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                selectedRating={selectedRating}
                

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
                  accountId={currAccount}
                  ownedApps={ownedApps}
                  setOwnedApps={setOwnedApps}
                  activeTorrents={activeTorrents}
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
                accountId={currAccount}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setIsUploading={setIsUploading}
                isUploading={isUploading}
              />
            }
          />

            <Route path={PagePaths.StatusPagePath} element={<StatusPage activeTorrents={activeTorrents}/>} />

        </Routes>
        {/*Prevents footer to hide content */}
        <div
          className="clear"
          style={{ clear: "both", height: "60px" }}
        ></div>{" "}
        <Footer />
      </HashRouter>
    </div>  );
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

}

export default App;
