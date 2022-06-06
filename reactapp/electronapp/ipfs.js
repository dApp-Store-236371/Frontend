const IPFS = require("ipfs-core")
console.log("RUNNING IPFS")

let ipfsNode = undefined

async function getIpfsNode() {
    if (ipfsNode === undefined) {
        ipfsNode = await IPFS.create({ repo: "./ipfs-repo" })
    }
    return ipfsNode
}

async function tmp() {
    const ipfsNode = await getIpfsNode()

    console.log("IPFS NODE CREATED")


    const data = 'Hello, Carmel Hecht'

    // const results = ipfsNode.add(data)

    // console.log(results)
    // for await (const { cid }
    //     of results) {
    //     // CID (Content IDentifier) uniquely addresses the data
    //     // and can be used to get it again.
    //     console.log(cid.toString())
    // }
}


module.exports = {
    tmp
}