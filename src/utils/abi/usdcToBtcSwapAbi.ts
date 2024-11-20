export const usdcToBtcSwapAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_swapContractAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint32",
          name: "srcChain",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "srcAddress",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "message",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "tcMemo",
          type: "string",
        },
      ],
      name: "CCMReceive",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "Call",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "srcChain",
          type: "uint32",
        },
        {
          internalType: "bytes",
          name: "srcAddress",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "message",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "cfReceive",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountIn",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountOut",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "SwapInitiated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "dstChain",
          type: "uint32",
        },
        {
          internalType: "bytes",
          name: "dstAddress",
          type: "bytes",
        },
        {
          internalType: "uint32",
          name: "dstToken",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "cfParameters",
          type: "bytes",
        },
      ],
      name: "xSwapToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  