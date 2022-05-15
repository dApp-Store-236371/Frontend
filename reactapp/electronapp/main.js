// Modules to control application life and create native browser window
const { app, BrowserWindow, session } = require("electron");

require("@electron/remote/main").initialize();
const {
  REACT_ADDRESS,
} = require("../src/ElectronCommunication/SharedElectronConstants");
const {
  ElectronMessages,
} = require("../src/ElectronCommunication/ElectronMessages");

const fs = require("fs");
const path = require("path");
const url = require("url");


function createWindow() {
  // Create the browser window.
  console.log("Creating Electron Window");
  //clearAllUserData();

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
      show: false,
    },
  });
  mainWindow.maximize();
  mainWindow.show();
  // and load the index.html of the app.
  console.log(`React Address: ${REACT_ADDRESS}`);

  mainWindow.loadURL(REACT_ADDRESS);

  // Open the DevTools.

  mainWindow.webContents.openDevTools({ mode: "detach" });
}

const { ipcMain } = require("electron");
const { dialog } = require("electron");

ipcMain.on("alert", (event, data) => {
  // here we can process the data
  // we can send reply to react using below code
  console.log("electron: ipc alert");
  dialog.showErrorBox("error title", "cool error");

  let date_ob = new Date();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  //event.reply("alert-demo-reply", `Showed alert at ${hours}:${minutes}:${seconds}`);
  event.returnValue = {
    payload: `Showed alert at ${hours}:${minutes}:${seconds}`,
  };
});

ipcMain.handle(ElectronMessages.ECHO_MSG, async (event, ...args) => {
  console.log(args);
  dialog.showErrorBox("error title", "cool async error");
  return args;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});


export function downloadMagnetLink(magnet_link) {
  
  var WebTorrent = require('webtorrent');
  var torrent_client = new WebTorrent();

  torrent_client.add(magnet_link, function (torrent) {
    torrent.on('done', function () {
      console.log('torrent download finished')
    })
  })
}

export function createMagnetLink(file) {
  var WebTorrent = require('webtorrent-hybrid')
  var torrent_client = new WebTorrent()

  client.seed(file, function (torrent) {
      console.log('Client is seeding ' + torrent.magnetURI)
  })
  return torrent.magnetURI;
}
