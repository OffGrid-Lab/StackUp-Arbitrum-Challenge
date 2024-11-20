export const UserRegistry_ABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "User__NotAvailable",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "firstName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "lastName",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "updateType",
				"type": "string"
			}
		],
		"name": "UserUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUser",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "firstName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lastName",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "creditScore",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "totalContributionAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "contributionFrequencyScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "cycleCompletionScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "consistencyScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "peerRatingScore",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_firstName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_lastName",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "_pinCode",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_telNumber",
				"type": "uint256"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_functioncaller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_consistencyScore",
				"type": "uint256"
			}
		],
		"name": "updateConsistencyScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_functioncaller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_contributionFrequencyScore",
				"type": "uint256"
			}
		],
		"name": "updateContributionFrequencyScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_functioncaller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_cycleCompletionScore",
				"type": "uint256"
			}
		],
		"name": "updateCycleCompletionScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_functioncaller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_peerRatingScore",
				"type": "uint256"
			}
		],
		"name": "updatePeerRatingScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_functioncaller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_totalContributionAmount",
				"type": "uint256"
			}
		],
		"name": "updateTotalContributionAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_functioncaller",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "_creditScore",
				"type": "int256"
			}
		],
		"name": "updateUserCreditScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "firstName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lastName",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "pinCode",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "telNumber",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"components": [
					{
						"internalType": "int256",
						"name": "creditScore",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "totalContributionAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "contributionFrequencyScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "cycleCompletionScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "consistencyScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "peerRatingScore",
						"type": "uint256"
					}
				],
				"internalType": "struct IUserRegistry.Scores",
				"name": "scores",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]as const