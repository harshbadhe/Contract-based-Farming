export const CONTRACT_ADDRESS = "0x3878B93EDA3AAa29b08411E418f2aE453a62aB1b";

export const CONTRACT_ABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "contractId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "orderId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmerWallet",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyerWallet",
				"type": "address"
			}
		],
		"name": "ContractCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "orderId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "farmerWallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "buyerWallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "cropName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "acres",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "deliveryDate",
				"type": "string"
			}
		],
		"name": "createContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "contractId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum FarmaFriendContract.Status",
				"name": "newStatus",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "StatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			},
			{
				"internalType": "enum FarmaFriendContract.Status",
				"name": "_newStatus",
				"type": "uint8"
			}
		],
		"name": "updateStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contracts",
		"outputs": [
			{
				"internalType": "string",
				"name": "orderId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "farmerWallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "buyerWallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "cropName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "acres",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "deliveryDate",
				"type": "string"
			},
			{
				"internalType": "enum FarmaFriendContract.Status",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getContract",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "orderId",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "farmerWallet",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "buyerWallet",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "cropName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "acres",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "deliveryDate",
						"type": "string"
					},
					{
						"internalType": "enum FarmaFriendContract.Status",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct FarmaFriendContract.ContractInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserContracts",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userContracts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];