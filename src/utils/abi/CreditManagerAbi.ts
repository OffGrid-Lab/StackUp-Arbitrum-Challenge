export const CreditManager_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "registryAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "NotRegistered__User",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "newScore",
				"type": "int256"
			}
		],
		"name": "CreditScoreUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "penaltyAmount",
				"type": "int256"
			}
		],
		"name": "Penalized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "rewardAmount",
				"type": "int256"
			}
		],
		"name": "Rewarded",
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
		"name": "getUserScores",
		"outputs": [
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
				"internalType": "struct CreditManager.UserScores",
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
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "reason",
				"type": "uint8"
			},
			{
				"internalType": "int256",
				"name": "penaltyAmount",
				"type": "int256"
			}
		],
		"name": "penalizeParticipant",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "reason",
				"type": "uint8"
			},
			{
				"internalType": "int256",
				"name": "rewardAmount",
				"type": "int256"
			}
		],
		"name": "rewardParticipant",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "reason",
				"type": "uint8"
			}
		],
		"name": "toString",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "updateCreditScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const