// Modules to control application life and create native browser window
// require('events').EventEmitter.setMaxListeners(20);
const { app, BrowserWindow, session } = require("electron");
const path = require("path");
app.disableHardwareAcceleration()

const { dialog } = require('electron');
const { downloadMagnetLink, seedTorrent, isSeedingOrDownloadingMagnetLink, getActiveTorrents, stopAllTorrents, getTorrents } = require('./torrent')
const crypto = require('crypto');

const { electronStore } = require('./electronStore')

require("@electron/remote/main").initialize();
const {
    REACT_ADDRESS,
} = require("../src/ElectronCommunication/SharedElectronConstants");
const {
    ElectronMessages,
} = require("../src/ElectronCommunication/ElectronMessages");

const fs = require("fs");
let torrentRecoveryData = []
let currAccountID = undefined

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



    if (app.isPackaged) {
        mainWindow.loadFile(process.resourcesPath + '\\app\\build\\index.html')
    } else {
        console.log(`React Address: ${REACT_ADDRESS}`);
        mainWindow.loadURL(REACT_ADDRESS)
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools({ mode: "detach" });

    reloadBackupTorrents()
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
        res.sha = await getSHA256(path)

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

        console.log("Finished succesffuly getting magnet link")
        torrentRecoveryData.push({
            magnetLink: magnetLink,
            path: path,
            sha: res.sha
        })

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
    console.log("expectedSha: ", argsObject['sha']);
    const expectedSha = argsObject['sha']
    const res = { success: false, errorMsg: "" }

    const magnet = argsObject.magnet;
    let path = argsObject.path
    if (path === undefined || path === "") {
        path = await getFilePath()
            // if (path === undefined || path === "") {
            //     res.success = false
            //     res.errorMsg = "No path selected"
            //     return res
            // }
    }

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

        torrentRecoveryData.push({
            magnetLink: magnet,
            path: path,
            sha: expectedSha
        })


        return res;
    } catch (err) {
        console.log("DEBUG: ", err)
        res.success = false
        res.errorMsg = err
        return res
    }
});

ipcMain.handle(ElectronMessages.GET_ACTIVE_TORRENT_DATA, async(event, ...args) => {
    // console.log("Electron GET ACTIVE TORRENT DATA")
    // console.log(args);
    // console.log("GETTING ACTIVE DATA")

    try {
        const torrents = await getActiveTorrents()
            // console.log("torrents: ", torrents)
        return torrents
    } catch (err) {
        console.error("Electron GET ACTIVE TORRENT DATA Exception: ", err)
        return []
    }

})

ipcMain.handle(ElectronMessages.ACCOUNT_ID_UPDATE, async(event, ...args) => {
    console.log("Electron UPDATE ACCOUNT ID")
    console.log(args);
    if (args.length === 0) {
        return
    }
    try {
        const newAccountId = JSON.parse(args[0]).currAccount
        console.log("newAccountId: ", newAccountId)
        if (newAccountId === "" || newAccountId === undefined) {
            //stop all torrents ?
            return
        }

        //backup previous account info
        saveActiveTorrents()

        currAccountID = newAccountId

        await reloadBackupTorrents()

        torrentRecoveryData = []
        return currAccountID

    } catch (err) {
        console.error("Electron UPDATE USER ID Exception: ", err)

    }
})

async function reloadBackupTorrents() {
    if (currAccountID === undefined) {
        return
    }
    const currAccountData = electronStore.get(currAccountID)
    console.log("currAccountData: ", currAccountData)

    if (currAccountData === undefined) {
        return
    }


    stopAllTorrents()
    for (let i = 0; i < currAccountData.length; i++) {
        const torrent = currAccountData[i]
        if ((await getSHA256(torrent.path)) === torrent.sha) {
            seedTorrent(torrent.path, path.basename(torrent.path))
        } else {
            downloadMagnetLink(torrent.magnetLink, torrent.path)
        }
    }


}

ipcMain.handle(ElectronMessages.REMOVE_TORRENT, async(event, ...args) => {
    console.log("Electron REMOVE TORRENT")
    const argsObject = JSON.parse(args[0])
    if (!argsObject || !argsObject.magnet) {
        return
    }
    const magnet = argsObject.magnet

    try {
        const torrents = getTorrents()
        const sameMagnetTorrents = torrents.filter(torrent => torrent.magnetURI === magnet)
        for (let torrent of sameMagnetTorrents) {
            torrent.destroy()
            console.log("torrent recovery before destroy: ", torrentRecoveryData)
            torrentRecoveryData = torrentRecoveryData.filter(item => item.magnetLink !== torrent.magnetURI)
            console.log("torrent recovery after destroy: ", torrentRecoveryData)
        }


    } catch (err) {
        console.error("Electron REMOVE TORRENT Exception: ", err)
    }
})




ipcMain.handle(ElectronMessages.SEED_TORRENT, async(event, ...args) => {
    console.log("Electron SEED FROM  MAGNET")
    console.log(args);

    try {

        console.log("Electron SEED TORRENT FROM MAGNET. args: ", args)
        const argsObject = JSON.parse(args[0])
        console.log("seed torrent from magnet: ", argsObject['magnet']);

        const res = { success: false, errorMsg: "" }

        const magnetLink = argsObject.magnet;
        const name = argsObject.name;
        const expectedSha = argsObject.sha;

        if (!magnetLink || magnetLink === "") {
            console.log("Empty Magnet Link")
            res.success = false
            res.errorMsg = "Failed to seed. Empty magnet link"
            return res
        }
        // console.log("CCCC", isSeedingOrDownloadingMagnetLink(magnetLink))

        if (isSeedingOrDownloadingMagnetLink(magnetLink)) {
            console.log("Already seeding magnet link")
            res.success = true
            res.errorMsg = "Already seeding!"
            return res
        }



        const path = await getFilePath()

        if (!path || path === "") {
            console.log("No file selected")
            res.success = false
            res.errorMsg = "No file selected"
            return res
        }
        console.log("expectedSha: ", expectedSha)
        if (expectedSha !== await getSHA256(path)) {
            console.log("File has been modified")
            res.success = false
            res.errorMsg = "Not same file (Different SHA256)"
            return res
        }

        await seedTorrent(path, name)
        console.log("magnetLink: " + magnetLink)


        res.success = true
        console.log("Finished succesffuly seeding provided magnet link")
        torrentRecoveryData.push({
            magnetLink: magnetLink,
            path: path,
        })

        return res;
    } catch (err) {
        console.log("Electron SEED_MAGNET Exception: ", err)
        return { success: false, errorMsg: err.message }
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

async function getSHA256(filePath) {
    try {
        console.log("getting sha256. Path: ", filePath)
        const fileBuffer = fs.readFileSync(filePath)
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const sha256 = hashSum.digest('hex');
        console.log("sha256: ", sha256)
    } catch (err) {
        console.log("Error getting sha256: ", err)
        return undefined
    }
}

// const createHashFromFile = filePath => new Promise(resolve => {
//     const hash = crypto.createHash('sha1');
//     fs.createReadStream(filePath).on('data', data => hash.update(data)).on('end', () => resolve(hash.digest('hex')));
//   });




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});




function saveActiveTorrents() {
    console.log("Saving active torrents for userid: ", currAccountID)
    if (currAccountID !== undefined && currAccountID !== "") {
        electronStore.set(currAccountID, torrentRecoveryData)
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", function() {

    saveActiveTorrents()


    // On macOS it is common for applications and their menu bar
    if (process.platform !== "darwin") app.quit();
});