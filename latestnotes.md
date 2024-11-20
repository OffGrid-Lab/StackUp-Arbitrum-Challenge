
menu.state("exchangeInvestment", {
  run: () => {
    menu.con("Saving with and Swaps. \n1. Swaps \n2. Ezi Loan");
  },
  next: {
    1: "swap",
    2: "Ezi Loan"
  },
});

menu.state("swap", {
  run: () => {
     menu.con("Swap to Any Crypto currency. Enter the amount  \n1.Enter USDcoins to Swap to BTC \n2. Enter amount BTC to USDcoins")
  },
  next:{
    1:"usdc_to_btc", 
    2:"btc_to_usdc"

  }
});



// btc to usdc 
menu.state("btc_to_usdc", {

  run: () => {
    menu.con("Enter the amount of BTC to swap to USDC:");
  },
  next: {
    "*\\d+(\\.\\d+)?$": "confirm_btc_usdc",
  }
})


menu.state("confirm_btc_usdc", {
  run:async()=>{
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }

    const amountToSwap = parseFloat(menu.val);
    console.log(amountToSwap, 'amountToSwap', menu.val)
     // if (isNaN(amountToSwap)) {
     //   menu.end("Invalid amount. Please try again.");
     //   return;
     // }
     sessions[sessionId]!.amountToSwap = amountToSwap;
     
     const response =  await depositRequest(amountToSwap, "0x70023E424761473EE2035e9cC4849A98950a4f38")
     console.log(response?.exchangeInfo, 'response')
     sessions[sessionId]!.response = response?.swapQuote
    
     menu.con(`You want to swap ${amountToSwap} BTC to USDC.\n You would receive ${response?.exchangeInfo.usdcReceived} \nEnter your address to receive the swapped amount:`);
    },
    next: {
      "*[a-zA-Z0-9]+": "execute_btc_to_usdc",
    },
})

menu.state("execute_btc_to_usdc", {
  run:async()=>{

    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
  }
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }

    const amountToSwap =    sessions[sessionId]!.amountToSwap;

    const ethAddress = menu.val;

    console.log(amountToSwap, 'amount to swap')

    try {
      // 0x70023E424761473EE2035e9cC4849A98950a4f38
      // 0x67C1235f3DcAaa3e3FC32c251ba942BF4BE94ECe
     const response = sessions[sessionId]!.response
     console.log(response, "from the in memory ")
    if(response){
      const requestAddress = await swapSDK.requestDepositAddress(response);
      console.log("Deposit Address:", requestAddress.depositAddress);
      console.log("Deposit Channel ID:", requestAddress.depositChannelId);
  


      sendBitcoin(requestAddress.depositAddress, requestAddress.amount)
      .then((result) => {
        console.log(result.tx.hash, "BROADCASTED ");
        console.log(requestAddress.depositAddress);
        const firstPart = result.tx.hash.slice(0, 27);
        const secondPart = result.tx.hash.slice(27, 54);
        const thirdPart = result.tx.hash.slice(54);
        menu.end(`Successfully Swapped BTC To USDC: \n${firstPart}\n${secondPart}\n${thirdPart}`)
      //   setupWebSocketListener(result.tx.hash);
      })
      .catch((error) => {
        menu.end("Failed to send  to BTC to swap")
      });
    }
    } catch (error) {
      console.error("Error in execute_usdc_to_btc:", error);
      if (error instanceof Error) {
        menu.end(`An error occurred: ${error.message}. Please try again later.`);
      } else {
        menu.end("An unknown error occurred. Please try again later.");
      }
    }

  }, 
})













// usdc to btc 
menu.state("usdc_to_btc", {
  run: () => {
    menu.con("Enter the amount of USDC to swap to BTC:");
  },
  next: {
    "*\\d+(\\.\\d+)?$": "confirm_usdc_to_btc",
  },
});

menu.state("confirm_usdc_to_btc", {
  run: async () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
  }
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }

    const amountToSwap = parseFloat(menu.val);
    console.log(amountToSwap, 'amountToSwap', menu.val)
    // if (isNaN(amountToSwap)) {
    //   menu.end("Invalid amount. Please try again.");
    //   return;
    // }
    sessions[sessionId]!.amountToSwap = amountToSwap;
    // sessions[sessionId] = { ...sessions[sessionId], amountToSwap };
    
    menu.con(`You want to swap ${amountToSwap} USDC to BTC.\nEnter your BTC address to receive the swapped amount:`);
  },
  next: {
    "*[a-zA-Z0-9]+": "execute_usdc_to_btc",
  },
});

menu.state("execute_usdc_to_btc", {
  run: async () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
  }
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }

    const amountToSwap =    sessions[sessionId]!.amountToSwap;
    const btcAddress = menu.val;

    console.log(amountToSwap, 'amount to swap')

    try {
      const phoneNumber = menu.args.phoneNumber;
      const passportSigner = await createPassportSigner({ username: phoneNumber });
      if (!passportSigner) {
        menu.end("Failed to create passport signer. Please try again later.");
        return;
      }

      const amountInWei = BigInt(Math.floor(amountToSwap * 1e6));
      const dstAddress = ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes("n2CBJ4s4NQcpUMnW3iimfVtjUqgzHPuA41")
      );
       // Convert to USDC's 6 decimal places
    menu.con("Check Transaction Hash \n 1. Continue")
    const result = await performTokenSwap(passportSigner, amountInWei, dstAddress);

    if(result){
      sessions[sessionId]!.userOps = result
    
    }
 

   
    } catch (error) {
      console.error("Error in execute_usdc_to_btc:", error);
      if (error instanceof Error) {
        menu.con(`An error occurred: ${error.message}. Please try again later.`);
      } else {
        menu.con("An unknown error occurred. Please try again later.");
      }
    }
  },
  next:{
    1:"txn_hash"
  }
});

menu.state("txn_hash", {
  run:async()=>{
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
  }
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }
    const txHash = sessions[sessionId]!.userOps;
    console.log(txHash, 'txhash')
    if (txHash) {
      console.log("DONE")
      const firstPart = txHash.slice(0, 27);
      const secondPart = txHash.slice(27, 54);
      const thirdPart = txHash.slice(54);
      menu.end(`Swap initiated successfully \n${firstPart}\n${secondPart}\n${thirdPart}`);

   } else {
     menu.end("Swap failed. Please try again later.");
   }

  }, 

})











//Loans 
