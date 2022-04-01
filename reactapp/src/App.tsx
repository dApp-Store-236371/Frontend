import React, { useEffect, useState } from "react";
import PurchasesPage from "./Pages/PurchasesPage/PurchasesPage";
import AppsCatalogPage from "./Pages/AppsPage/AppsCatalogPage";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import isElectron from "is-electron";
import { ElectronMessages } from "./ElectronCommunication/ElectronMessages";
import ReactDOM from "react-dom";
import NavigationBar from "./Pages/Shared/NavigationBar";
import Footer from "./Pages/Shared/Footer";
import SideNav from "./Pages/Shared/SideNav";
import { IS_ON_ELECTRON } from "./ElectronCommunication/SharedElectronConstants";
import UploadPage from "./Pages/UploadPage/UploadPage";
import { PagePaths } from "./ReactConstants";
import AppData from "./Pages/AppsPage/AppData";
import DUMMY_APPS from "./Web3Communication/DebugDummies/DummyApps";
import AppDetailsModal from "./Pages/AppsPage/Components/AppDetailsModal";
//import Web3Test from "./Web3Communication/Web3Modal2";
import PublishedPage from "./Pages/MyPublishedPage/PublishedPage";
import { toast } from "react-toastify";
//import { web3Modal } from "./Web3Communication/Web3Modal4";
import "react-toastify/dist/ReactToastify.css";
//import { Web3Test2 } from "./Web3Communication/Web3Modal3";
//import { Web3Test4 } from "./Web3Communication/Web3Modal4";
//import Web3Test from "./Web3Communication/Web3Modal2";
import { Web3Test2 } from "./Web3Communication/Web3Modal3";
import Web3 from "web3";
import { Web3Demo1 } from "./Pages/Web3Demos/Web3Demo";
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

//const provider = await web3Modal.connect()
//let web3 = new Web3();
//web3.setProvider(new web3.providers.H());

function App() {
  const [displayedApps, setDisplayedApps] = useState<Array<AppData>>([]);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [publishedApps, setPublishedApps] = useState<AppData[]>([]);
  const [ownedApps, setOwnedApps] = useState<AppData[]>([]);

  const [userId, setUserId] = useState<string>("");

  const [provider, setProvider] = useState();
  const [web3, setWeb3] = useState(new Web3());
  const changeProvider = (new_provider: any) => {
    console.log("Provider has changed from ", provider, "to ", new_provider);

    web3.eth.getAccounts().then((accounts: string[]) => {
      console.log("accounts: ", accounts);
      console.log("accounts[0]: ", accounts[0]);
    });
    console.log("got here");
    setProvider(provider);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Web3Test2 web3={web3} changeProvider={changeProvider} />
        <button
          onClick={() => {
            console.log(web3);
          }}
        >
          {" "}
          Print Btn
        </button>
        <button
          onClick={() => {
            web3.setProvider("ws://localhost:7545");
            // @ts-ignore
            //web3.currentProvider();
            // @ts-ignore
            changeProvider(web3.currentProvider);
            web3.eth
              .getBalance("0x24Eb8E8e144E14AB7B3071B5312cc38ED01F6C52")
              .then(console.log);
          }}
        >
          {" "}
          Connect Ganache{" "}
        </button>
        <SideNav />
        <NavigationBar
          setNumberOfPages={setNumberOfPages}
          setDisplayedApps={setDisplayedApps}
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
              />
            }
          />
          <Route
            path={PagePaths.PurchasesPagePath}
            element={
              <PurchasesPage
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                userId={userId}
                ownedApps={ownedApps}
                setOwnedApps={setOwnedApps}
              />
            }
          />
          <Route path={PagePaths.UploadPagePath} element={<UploadPage />} />
          <Route path={PagePaths.NotFoundPagePath} element={<ErrorPage />} />
          <Route
            path={"/web3demo1"}
            element={<Web3Demo1 web3={web3} changeProvider={changeProvider} />}
          />

          <Route
            path={PagePaths.MyPublishedPagePath}
            element={
              <PublishedPage
                publishedApps={publishedApps}
                setPublishedApps={setPublishedApps}
                userId={userId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
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
      </BrowserRouter>
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

/*
<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <p>
    Edit <code>src/App.js</code> and save to reload.
  </p>
  <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
  >
    Learn React
  </a>
</header>
*/
