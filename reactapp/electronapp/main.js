// Modules to control application life and create native browser window
const { app, BrowserWindow, session } = require("electron");
const path = require("path");
app.disableHardwareAcceleration()
const { dialog } = require('electron');
const { downloadMagnetLink, seedTorrent } = require('./torrent')



require("@electron/remote/main").initialize();
const {
    REACT_ADDRESS,
} = require("../src/ElectronCommunication/SharedElectronConstants");
const {
    ElectronMessages,
} = require("../src/ElectronCommunication/ElectronMessages");

const fs = require("fs");
const url = require("url");

function createWindow() {
    // Create the browser window.
    console.log("Creating Electron Window");
    //clearAllUserData();
    console.log(process.resourcesPath)
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
    /* Development */
    //mainWindow.loadURL(REACT_ADDRESS);

    /* Compiled React */
    //mainWindow.loadFile('.\\build\\index.html')

    /* Packaged App */
    //mainWindow.loadFile('process.resourcesPath'+'\\index.html')
    if (app.isPackaged) {
        mainWindow.loadFile(process.resourcesPath + '\\app\\build\\index.html')
    } else {
        mainWindow.loadURL(REACT_ADDRESS)
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools({ mode: "detach" });


    // const path = await getFilePath()
    // console.log(path)
    // if (!path || path === "") {
    //     console.log("No file selected")
    //     return
    // }

    // const magnetLink = await seedTorrent(path)
    // downloadMagnetLink(magnetLink)
}


const { ipcMain } = require("electron");

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

ipcMain.handle(ElectronMessages.ECHO_MSG, async(event, ...args) => {
    console.log(args);
    dialog.showErrorBox("error title", "cool async error");
    return args;
});

ipcMain.handle(ElectronMessages.CREATE_MAGNET, async(event, ...args) => {
    console.log("Electron CREATE MAGNET")
    console.log(args);

    try {

        const res = { success: false, magnet: undefined, sha: undefined, errorMsg: "" }
        const path = await getFilePath()

        if (!path || path === "") {
            console.log("No file selected")
            res.success = false
            res.errorMsg = "No file selected"
            return res
        }

        const magnetLink = await seedTorrent(path)
        console.log("magnetLink2: " + magnetLink)

        if (!magnetLink || magnetLink === "") {
            console.log("Failed to create magnet link")
            res.success = false
            res.errorMsg = "Failed to seed"
            return res
        }

        res.success = true
        res.magnet = magnetLink
        res.sha = path
        console.log("Finished succesffuly getting magnet link")
        return res;
    } catch (err) {
        console.log("Electron CREATE_MAGNET Exception: ", err)
        return { success: false, magnet: undefined, sha: undefined, errorMsg: err.message }
    }
});

ipcMain.handle(ElectronMessages.DOWNLOAD_TORRENT, async(event, ...args) => {
    console.log("Electron DOWNLOAD TORRENT. args: ", args)
    const argsObject = JSON.parse(args[0])
    console.log("download magnet: ", argsObject['magnet']);

    const res = { success: false, errorMsg: "" }

    const magnet = argsObject.magnet;
    const path = argsObject.path
    console.log("Args object path: ", path)
    try {

        if (!magnet) {
            console.log("No magnet link")
            res.success = false
            res.errorMsg = "No magnet link"
            return res
        }
        downloadMagnetLink(magnet, path)

        res.success = true
        return res;
    } catch (err) {
        console.log("DEBUG: ", err)
        res.success = false
        res.errorMsg = err
        return res
    }
});


async function getFilePath() {
    return await dialog.showOpenDialog({ properties: ['openFile'] }).then(function(response) {
        if (!response.canceled) {
            // handle fully qualified file name
            console.log(response.filePaths[0]);

            return (response.filePaths[0])
        } else {
            console.log("no file selected");
            return ("")
        }
    })
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit();
});