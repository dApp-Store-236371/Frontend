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




async function createWindow() {
    // Create the browser window.
    console.log("Creating Electron Window");
    //clearAllUserData();
    console.log(process.resourcesPath)
        // const mainWindow = new BrowserWindow({
        //   width: 800,
        //   height: 600,
        //   webPreferences: {
        //     preload: path.join(__dirname, "preload.js"),
        //     nodeIntegration: true,
        //     enableRemoteModule: true,
        //     contextIsolation: false,
        //     webSecurity: false,
        //     show: false,
        //   },
        // });
        // mainWindow.maximize();
        // mainWindow.show();
        // and load the index.html of the app.



    //console.log(`React Address: ${REACT_ADDRESS}`);
    /* Development */
    //mainWindow.loadURL(REACT_ADDRESS);

    /* Compiled React */
    //mainWindow.loadFile('.\\build\\index.html')

    /* Packaged App */
    //mainWindow.loadFile('process.resourcesPath'+'\\index.html')
    // if(app.isPackaged){
    //   mainWindow.loadFile(process.resourcesPath+'\\app\\build\\index.html')
    // }
    // else{
    //   mainWindow.loadURL(REACT_ADDRESS)
    // }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({ mode: "detach" });
    // console.log("HERE")
    // downloadMagnetLink("magnet:?xt=urn:btih:3fdfd10740464d52823bf3dec54bdc6ae6c6b669&dn=.gitignore&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com")
    // downloadMagnetLink('magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent') 
    //torrentUploadExperiment()

    // await uploadToIPFS()
    // await downloadFromIPFS()


    //torrentUploadExperiment()
    console.log("A")
        // downloadMagnetLink(
        //     "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"
        // )

    const path = await getFilePath()
    console.log(path)
    if (!path || path === "") {
        console.log("No file selected")
        return
    }

    const magnetLink = await seedTorrent(path)

    console.log("Main: ", magnetLink)

    await new Promise(resolve => setTimeout(resolve, 20000));
    while (true) {
        //sleep in js
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
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


    const path = await dialog.showOpenDialog({ properties: ['openFile'] }).then(function(response) {
        if (!response.canceled) {
            // handle fully qualified file name
            console.log(response.filePaths[0]);
            return (response.filePaths[0])
        } else {
            console.log("no file selected");
            return ("")
        }
    })
    console.log("path = ", path)
        // createMagnetLink(path);

    return args;
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

// async function torrentUploadExperiment() {
//     const path = await getFilePath()

//     const [magnet_link, client] = await createMagnetLink(path)
//     console.log("IM RIGHT HERE PRINTING")
//     console.log(magnet_link)
//     downloadMagnetLink(magnet_link)
//         // while(true){
//         //   //sleep in javascript 

//     //   await new Promise(resolve => setTimeout(resolve, 1000));
//     //   console.log("Still seeding probably")
//     //   console.log("upload speed: ", client.uploadSpeed)


//     // }


// }



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


// function downloadMagnetLink(magnet_link) {
//     var WebTorrent = require('webtorrent');
//     var torrent_client = new WebTorrent();
//     console.log("Initiate download of torrent")
//     torrent_client.add(magnet_link, { path: "D:\\testtest" }, function(torrent) {
//         onTorrent2(torrent)
//         torrent.on('done', function() {
//             console.log('torrent download finished')
//             return
//         })
//     });
// }


// function onTorrent2(torrent) {
//     console.log('Got torrent metadata!')
//     console.log(
//         'Torrent info hash: ' + torrent.infoHash + ' ' +
//         '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> '
//         // '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
//     )

//     // Print out progress every 5 seconds
//     var interval = setInterval(function() {
//         console.log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
//     }, 5000)

//     torrent.on('done', function() {
//         console.log('Progress2: 100%')
//         clearInterval(interval)
//     })

//     // Render all files into to the page
//     // torrent.files.forEach(function (file) {
//     //   file.appendTo('.log')
//     //   console.log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works. "file://" does not.)')
//     // file.getBlobURL(function (err, url) {
//     //   if (err) return log(err.message)
//     //   console.log('File done.')
//     //   console.log('<a href="' + url + '">Download full file: ' + file.name + '</a>')
//     // })
//     // })
// }


// function onDownloadTorrent(torrent) {
//     console.log("onDownloadTorrent")
//     const progress = (100 * torrent.progress).toFixed(1)

//     function updateSpeed() {
//         DoUpdateSpeed(
//             '<b>Peers:</b> ' + torrent.numPeers + ' ' +
//             '<b>Progress:</b> ' + progress + '% '
//         )
//     }

//     torrent.on('done', function() {
//         console.log('torrent download finished')
//         return
//     })
//     updateSpeed()
// }
// //   torrent_client.add(magnet_link, function (torrent) {
// //     console.log("Downloading torrent from magnet link: " + magnet_link);
// //     torrent.on('done', function () {
// //       console.log('torrent download finished')
// //     })
// //   })



// async function createMagnetLink(file) {
//     const WebTorrent = require('webtorrent')
//     console.log('entered createMagnetLink from electron. file=', file)
//     var client = new WebTorrent()
//     const magnet = await seed([file], client);
//     return [magnet, client]

//     // torrent_client.seed(file, function (torrent) {
//     //   //   console.log('Client is seeding ' + torrent.magnetURI)
//     //   // console.log("in seed: ", torrent)
//     //   // res = torrent.magnetURI
//     //   // return res
//     //   console.log("MANGET AVAILABE HERE ", torrent.magnetURI)
//     //   return torrent.magnetURI
//     // })
// }


// warning = function warning(err) {
//     console.error(err.stack || err.message || err)
//     return console.log(err.message || err)
// }

// error = function error(err) {
//     console.error(err.stack || err.message || err)
//     const p = console.log(err.message || err)
//     p.style.color = 'red'
//     p.style.fontWeight = 'bold'
//     return p
// }


// async function seed(files, client) {
//     if (files.length === 0) return
//     console.log('Seeding ' + files.length + ' files')

//     // Seed from WebTorrent
//     // await client.seed(files,  function(torrent) {
//     //   console.log('Client is seeding ' + torrent.magnetURI)
//     //   console.log("in seed: ", torrent)
//     //   res = torrent.magnetURI
//     //   return res
//     // })
//     console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
//     let magnet = undefined

//     magnet_setter = (torrent) => {
//         console.log("in magnet_setter: ", torrent)
//         magnet = torrent.magnetURI
//         return magnet
//     }

//     const tmp = await client.seed(files, (torrent) => magnet_setter(torrent))

//     while (magnet === undefined) {

//         // sleep in javascript
//         // console.log("sleeping")
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // sleep(10)
//     }
//     console.log("magnet is: ", magnet)
//     return magnet

//     // const tmp =  await client.seed(files,  function (torrent) {
//     //   console.log('Client is seeding ' + torrent.magnetURI)
//     //   // onTorrent(torrent)
//     //   magnet = torrent.magnetURI
//     // })



// // await 
// console.log(tmp)
// console.log("blablba")
// return magnet
// }

// DoUpdateSpeed = function DoUpdateSpeed(str) {
//     console.log(str)
// }


// function onTorrent(torrent) {
//     torrent.on('warning', warning)

//     const torrentFileName = path.basename(torrent.name, path.extname(torrent.name)) + '.torrent'

//     console.log('"' + torrentFileName + '" contains ' + torrent.files.length + ' files:')
//     console.log("Magnet URL: " + torrent.magnetURI)

//     function updateSpeed() {
//         const progress = (100 * torrent.progress).toFixed(1)
//             // const progress = torrent.progress
//             // if (progress == 100.0) {
//             //   console.log('Download complete')
//             //   return 1
//             // }
//             // let remaining
//             // if (torrent.done) {
//             //   // remaining = 'Done.'
//             //   return torrent.magnetURI
//             // } 
//             // else {
//             //   remaining = torrent.timeRemaining !== Infinity
//             //     ? torrent.timeRemaining
//             //     : 'Infinity years'
//             //   remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
//             // }

//         DoUpdateSpeed(
//             '<b>Peers:</b> ' + torrent.numPeers + ' ' +
//             '<b>Progress:</b> ' + progress + '% '
//             // '<b>ETA:</b> ' + remaining
//         )
//         return 0
//     }

//     torrent.on('download', throttle(updateSpeed, 250))
//     torrent.on('upload', throttle(updateSpeed, 250))
//     setInterval(updateSpeed, 5000)
//     if (updateSpeed() == 1) {
//         return torrent.magnetURI
//     }
// }