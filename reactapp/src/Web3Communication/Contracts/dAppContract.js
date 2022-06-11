import { createContract } from "../Web3Utils";

export const DAPPSTORE_CONTRACT_ADDRESS =
    "0x1F70E98Da4Cfc4695Fe6D764255CA084ac789BBd"
    //"0x4b41234D02E379400EfBEE11AB15797a6c0c82dA"
    //"0x1024f69C9F88639A72A8123A3a03ebdeD2E0A803"; //Version 5 Rinkeby, getApps requires sender
    //"0xded7fF8aA48c2Cf503d90B9b15f784cBf201f299"; //Version 4 Rinkeby, can purchase apps
    //"0xf57E8de4645c45a0c93DC59a5A2D765BBEC8c53E"; //Version 3 Rinkeby, with get purchased & uploaded & update apps
    //"0x9fb632ad470c88cc858206b24b2b1a1d46b8c001"; //Version 2 Rinkeby
    // "0x343f80e459c60b6e1EEae3E469a95213DD3c36C0"; //Version 1 Rinkeby
    //"0xa1879B8f434c0BE3ABb662A269F72496C7047d9E"; //GANACHE


export const DAPPSTORE_ABI = [{
        "inputs": [{
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_magnetLink",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_imgUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_company",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_fileSha256",
                "type": "string"
            }
        ],
        "name": "createNewApp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "num_apps",
            "type": "uint256"
        }],
        "name": "createXApps",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "app_id",
            "type": "uint256"
        }],
        "name": "purchaseApp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "app_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_magnetLink",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_imgUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_company",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_fileSha256",
                "type": "string"
            }
        ],
        "name": "updateApp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "start",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "len",
                "type": "uint256"
            }
        ],
        "name": "getAppBatch",
        "outputs": [{
            "components": [{
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "imgUrl",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "company",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "num_ratings",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "rating",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "rating_modulu",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "fileSha256",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "owned",
                    "type": "bool"
                }
            ],
            "internalType": "struct AppInfoLibrary.AppInfo[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAppCount",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]

//Version 2
// export const DAPPSTORE_ABI = [{
//         "inputs": [{
//                 "internalType": "address",
//                 "name": "creator",
//                 "type": "address"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_name",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_description",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_magnetLink",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_imgUrl",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_company",
//                 "type": "string"
//             },
//             {
//                 "internalType": "uint256",
//                 "name": "_price",
//                 "type": "uint256"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_fileSha256",
//                 "type": "string"
//             }
//         ],
//         "name": "createNewApp",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [{
//             "internalType": "address",
//             "name": "app_address",
//             "type": "address"
//         }],
//         "name": "purchaseApp",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "inputs": [{
//                 "internalType": "uint256",
//                 "name": "app_id",
//                 "type": "uint256"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_name",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_description",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_magnetLink",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_imgUrl",
//                 "type": "string"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_company",
//                 "type": "string"
//             },
//             {
//                 "internalType": "uint256",
//                 "name": "_price",
//                 "type": "uint256"
//             },
//             {
//                 "internalType": "string",
//                 "name": "_fileSha256",
//                 "type": "string"
//             }
//         ],
//         "name": "updateApp",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [{
//                 "internalType": "uint256",
//                 "name": "start",
//                 "type": "uint256"
//             },
//             {
//                 "internalType": "uint256",
//                 "name": "len",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getAppBatch",
//         "outputs": [{
//             "components": [{
//                     "internalType": "uint256",
//                     "name": "id",
//                     "type": "uint256"
//                 },
//                 {
//                     "internalType": "string",
//                     "name": "name",
//                     "type": "string"
//                 },
//                 {
//                     "internalType": "string",
//                     "name": "description",
//                     "type": "string"
//                 },
//                 {
//                     "internalType": "string",
//                     "name": "imgUrl",
//                     "type": "string"
//                 },
//                 {
//                     "internalType": "string",
//                     "name": "company",
//                     "type": "string"
//                 },
//                 {
//                     "internalType": "uint256",
//                     "name": "price",
//                     "type": "uint256"
//                 },
//                 {
//                     "internalType": "uint256",
//                     "name": "num_ratings",
//                     "type": "uint256"
//                 },
//                 {
//                     "internalType": "uint256",
//                     "name": "rating",
//                     "type": "uint256"
//                 },
//                 {
//                     "internalType": "uint256",
//                     "name": "rating_modulu",
//                     "type": "uint256"
//                 },
//                 {
//                     "internalType": "string",
//                     "name": "fileSha256",
//                     "type": "string"
//                 },
//                 {
//                     "internalType": "bool",
//                     "name": "owned",
//                     "type": "bool"
//                 }
//             ],
//             "internalType": "struct AppInfoLibrary.AppInfo[]",
//             "name": "",
//             "type": "tuple[]"
//         }],
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "getAppCount",
//         "outputs": [{
//             "internalType": "uint256",
//             "name": "",
//             "type": "uint256"
//         }],
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "name",
//         "outputs": [{
//             "internalType": "string",
//             "name": "",
//             "type": "string"
//         }],
//         "stateMutability": "view",
//         "type": "function"
//     }
// ]