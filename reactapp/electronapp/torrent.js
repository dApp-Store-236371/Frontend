const { dialog } = require('electron');
const isElectron = require('is-electron');
const path = require("path");
const WebTorrent = require('webtorrent-hybrid')



const torrentClient = new WebTorrent();

torrentClient.on('error', function(err) {
    console.log('Client Error: ' + err)
})

torrentClient.on('torrent', function(torrent) {
    console.log('Client Torrent: ' + torrent.name)
})



const announceList = [
    // ['udp://tracker.leechers-paradise.org:6969'],
    // ['udp://tracker.coppersurfer.tk:6969'],
    ['udp://tracker.opentrackr.org:1337'],
    // ['udp://explodie.org:6969'],
    // ['udp://tracker.empire-js.us:1337'],
    ['wss://tracker.btorrent.xyz'],
    ['wss://tracker.openwebtorrent.com'],

    ['udp://tracker.openbittorrent.com:80'],
    // ['udp://tracker.coppersurfer.tk:6969'],
    ['udp://tracker.openbittorrent.com:80/announce'],
    // ['wss://tracker.fastcast.nz'],
    ['wss://tracker.btorrent.xyz'],
    ['udp://tracker.openbittorrent.com:80'],
    ['http://tracker2.wasabii.com.tw:6969/announce'],
    // ['udp://tracker.sktorrent.net:6969/announce'],
    ['http://www.wareztorrent.com:80/announce'],

]

async function downloadMagnetLink(magnetLink, downloadPath = "C:\\daapstoreDownloads") {
    console.log("B")
    try {
        torrentClient.add(magnetLink, { path: downloadPath }, function(torrent) {
            console.log('Client is downloading:', torrent.name)
            addTorrentEventListeners(torrent)
        })
    } catch (err) {
        console.log("Exception in downloadMagnetLink: ", err)
    }
    console.log("C")

}


async function seedTorrent(torrentPath, name) {
    try {
        let magnetURI = undefined

        const torrent = torrentClient.seed(torrentPath, { name: name, announceList: announceList }, function(torrent) {
            console.log('Client is seeding:', torrent.name)
            console.log('Magnet Link: ', torrent.magnetURI)


            console.log("ALL Torrents: ", torrentClient.torrents)
            const torrentsWithSameInfoHash = torrentClient.torrents.filter(t => t.infoHash === torrent.infoHash)
            console.log("torrentsWithSameInfoHash: ", torrentsWithSameInfoHash)
            if (torrentsWithSameInfoHash.length > 0) {
                console.log("Torrent already exists with magnet link: ", torrentsWithSameInfoHash[0].magnetURI)
                magnetURI = torrentsWithSameInfoHash[0].magnetURI
                return
            } else {
                // console.log("Trackers: ", torrent.announceList)
                addTorrentEventListeners(torrent)
                magnetURI = torrent.magnetURI
                console.log("Added event Listeners")
            }


        })

        let timeout_counter = 30
        while (!magnetURI) {

            if (timeout_counter === 0) {
                throw new Error("Timeout")
            }

            //sleep in js
            await new Promise(resolve => setTimeout(resolve, 1000));

            timeout_counter--

            // console.log("Waiting for magnet URI", torrent.magnetURI, torrent)
        }
        // console.log("AAAAAAAAAAAAAAA")
        return magnetURI

    } catch (err) {
        console.log("Exception in seedTorrent: ", err)
        return ""
    }

}


async function addTorrentEventListeners(torrent) {
    torrent.on('done', function() {
        console.log('Client is done downloading:', torrent.name)
    })

    torrent.on('error', function(err) {
        console.log(`Torrent named ${torrent.name} error: `, err)
    })

    torrent.on('warning', function(warn) {
        console.log(`Torrent named ${torrent.name} warning: `, warn)
        console.log('trackers: ', torrent.announceList)
    })

    torrent.on('download', function(bytes) {
        console.log(`Torrent named ${torrent.name} downloaded ${bytes} bytes. Speed: ${torrent.downloadSpeed} bytes/s. progress: ${torrent.progress}`)
    })

    torrent.on('upload', function(bytes) {
        console.log(`Torrent named ${torrent.name} uploaded ${bytes} bytes. Speed: ${torrent.uploadSpeed} bytes/s.`)
    })

    torrent.on('wire', function(wire, addr) {
        console.log(`Torrent named ${torrent.name} connected to peer with address ` + addr)
    })
}


module.exports = {
    downloadMagnetLink,
    seedTorrent
}