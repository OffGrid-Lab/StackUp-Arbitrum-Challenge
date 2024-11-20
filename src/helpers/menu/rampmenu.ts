import UssdMenu from "ussd-builder";
import {ERC20_ABI}from "../../utils/abi/ERC20Factory.js"
import { BigNumber, ethers } from "ethers";
import { contributeToPool, createNewSavingsPool, swapSDK } from "@/utils/btcflip/index.js";
import { depositRequest } from "@/utils/btcflip/index.js";
import { createOnRampQuote,submitOnRampQuote, getTransactionOnRampStatus , getTransactionRateOnRamp, submitOffRampQuote, createOffRampQuote} from "@/utils/ramp/index.js";
import { CreateOnRampQuoteRequest, CreateQuoteOffRampResponse, CreateQuoteOnRampResponse, Sessions, SubmitQuoteOffRampResponse, SubmitQuoteOnRampResponse } from "@/utils/types.js";
import { getUserById, getUserByPhoneNumber } from "@/models/userModel.js";
import {dummyTokens} from "@/utils/constant/dummyTokens.js"
import { TokenType,  createSwapQuote,  fetchTokenAddresses, getProvider, getTokenBalance, rampHeaders } from "@/utils/constant/index.js";
import { encodeFunctionData, Hex } from 'viem'
import { createPassportSigner, getAccountClientForSmartWallet } from "@/utils/passport/passport.js";

import { performTokenSwap, sendBitcoin } from "@/utils/btcflip/index.js";
import { getbalance } from "@/utils/btcflip/bitcoinWallet.js";
// export default (menu:UssdMenu, sessions:Sessions) => {
 
// menu.state("main menu", {
//   run: async () => {
//     const sessionId: string = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//   }
//     if (!sessions[sessionId]) {
//         sessions[sessionId] = {};
//     }
//     menu.con(`Shika Wallet Services
//       1. Buy USDcoins
//       2. Send USDcoins
  
//       3. Withdraw USDcoins
//       4. Susu Savings
//       6. Cross Border To Nigeria
//       7. Get Wallet Address 
//       8. Check Balance
//     `);
//   },
//   next: {
//     1: "buyUSDcoins",
//     2: "sendUSDcoins",
//     3: "withdrawUSDcoins",
//     4: "susu",
//     5: "getWalletAddress",
//     6: "checkBalance",
//   }
// });

// menu.state("buyUSDcoins", {
//   run: () => {
//     menu.con("Enter amount in GHS to buy USDC:");
//   },
//   next: {
//     "*\\d+$": "createOnRampQuote",
//   },
// });

// menu.state("createOnRampQuote", {
  
//     run: async () => {
      
//     const sessionId: string = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//   }
//     if (!sessions[sessionId]) {
//         sessions[sessionId] = {};
//     }
//       const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber)
//       if (!walletSmartAddress?.smartContractWallet) {
//         menu.end("Failed to retrieve wallet address. Try again later.");
//         return;
//       }
//       const fiatAmount = menu.val;
//       const phoneNumber = menu.args.phoneNumber;
//       const requestData = {
//         customer: {
//           phoneNumber: phoneNumber,
//           accountName: "kwame",
//           network: "MTN",
//         },
//         fiatAmount: parseFloat(fiatAmount),
//         fiatCurrency: "GHS",
//         chain: "ARBITRUM",
//         token: "USDC",
//         receiverAddress: walletSmartAddress.smartContractWallet,
//       };
  

//       const response = await createOnRampQuote(requestData) 
    

//       if (response && response.success) {
//         const quoteId= response && response.data && response.data.quoteId
//         const rate = response && response.data && response.data.rate
//         sessions[sessionId]!.createOnRampquoteId = quoteId
        
//         menu.con(`Quote Submission Rate: ${rate.value}\n1. Confirm Purchase`);
//       } else {
//         menu.end("Failed to create quote. Try again later.");
//       }
//     },
//     next: {
//       1: "submitOnRampQuote",
//     },
// });

// menu.state("submitOnRampQuote", {
//     run: async () => {
//       const sessionId: string = menu.args.sessionId;
//       if (!sessionId) {
//         menu.end("Session expired. Please try again.");
//         return;
//     }
//       if (!sessions[sessionId]) {
//           sessions[sessionId] = {};
//       }
//       const quoteId = sessions[sessionId]!.createOnRampquoteId 
//       console.log(quoteId, "before we submit this is the quote")
//       const response = await submitOnRampQuote(quoteId) as unknown as SubmitQuoteOnRampResponse
//       console.log(response, 'response for onramp')
//       if (response &&  response?.success) {
//         menu.end(`Purchase successful. Your transaction ID is ${response?.data?.transactionId}. \n1. Back to main menu`);
//       } else {
//         menu.end("Failed to submit quote. Try again later.");
//       }
//     },
  
// });


// // send usdc coins to others 
// menu.state("sendUSDcoins", {
//   run: () => {
//     menu.con("Enter recipient's address / Telephone Number:");
//   },
//   next: {
//     "*^0x[a-fA-F0-9]{40}$": "enterAmountToSend",
//   },
// });

// menu.state("enterAmountToSend", {
//   run: () => {
//     const sessionId = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//   }
//     if(!sessions[sessionId]){
//       sessions[sessionId] = {}
//     }

//     sessions[sessionId]!.recipient = menu.val;
//     menu.con("Enter amount in USDC to send:");
//   },
//   next: {
//     "*\\d+(\\.\\d+)?$": "sendUSDCOperation",
//   },
// });

// menu.state("sendUSDCOperation", {
//   run: async () => {
//     const sessionId = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//     }

//     const recipientAddress = sessions[sessionId]?.recipient;
//     const amountToSend = parseInt(menu.val);

//     if (!recipientAddress || isNaN(amountToSend)) {
//       menu.end("Invalid recipient or amount. Please try again.");
//       return;
//     }

  
//     try {
//       let msgSenderWalletAddress;
//       if (recipientAddress.slice(0, 2) !== "0x") {
//         const walletSmartAddress = await getUserByPhoneNumber(recipientAddress);
//         const address = walletSmartAddress?.smartContractWallet!;
        
//         const tokenAddresses = await fetchTokenAddresses() as TokenType;
//         const getUscObject = tokenAddresses.find((value)=> value.symbol =="USDC")!
//         const balance = await getTokenBalance(address, getUscObject.address) as ethers.BigNumberish
//         const formattedBalance = ethers.utils.formatUnits(balance, getUscObject.decimals);
//         const balanceToShow = ethers.BigNumber.from(formattedBalance).gt(0) ? true : false;
//         if(balanceToShow ===  false){
//           menu.end("Not enough money in wallet")
//          }
//         if (!walletSmartAddress?.smartContractWallet) {
//           menu.end("Recipient's wallet address not found. Please check the phone number and try again.");
//           return;
//         }
//       } else {
//         msgSenderWalletAddress = recipientAddress as `0x${string}`;
//       }

//       const phoneNumber = menu.args.phoneNumber;
//       const passportSigner = await createPassportSigner({ username: phoneNumber });
//       if (!passportSigner) {
//         menu.end("Failed to create passport signer. Please try again later.");
//         return;
//       }

//       const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
//       if (!smartAccountClient) {
//         menu.end("Failed to get smart account client. Please try again later.");
//         return;
//       }

//       const encodedFunctionData = encodeFunctionData({
//         abi: ERC20_ABI,
//         functionName: "transfer",
//         args: [msgSenderWalletAddress, BigInt(amountToSend * 10 ** 6)],
//       });

//       const response = await smartAccountClient.sendUserOperation({
//         uo: {
//           target: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
//           data: encodedFunctionData,
//           value: BigInt(0),
//         },
//       });

//       console.log(response, "response");

//       if (response?.hash) {
//         menu.end(`Transfer successful. Transaction hash: ${response.hash}.`);
//       } else {
//         menu.end("Transfer failed. No transaction hash received. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error in sendUSDCOperation:", error);
//       if (error instanceof Error) {
//         if (error.message.includes("insufficient balance")) {
//           menu.end("Insufficient balance to complete the transfer. Please check your balance and try again.");
//         } else if (error.message.includes("gas")) {
//           menu.end("Not enough gas to complete the transaction. Please try again later or with a smaller amount.");
//         } else {
//           menu.end(`An error occurred: ${error.message}. Please try again later.`);
//         }
//       } else {
//         menu.end("An unknown error occurred. Please try again later.");
//       }
//     }
//   },
  
// });
// // menu.state("sendUSDCOperation", {
// //   run: async () => {
// //     const sessionId = menu.args.sessionId;
// //     const recipientAddress = sessions[sessionId]!.recipient // Address from the previous step
// //     const amountToSend = parseInt(menu.val) 
// //     console.log(recipientAddress.slice(0,2) !== "0x", )
// //     if(recipientAddress.slice(0,2) !== "0x"){
// //       const walletSmartAddress = await getUserByPhoneNumber(recipientAddress)
// //       const msgSenderWalletAddress = walletSmartAddress?.smartContractWallet as `0x${string}`
     
// //       const passportSigner = await createPassportSigner({ username: recipientAddress });
                  
// //       const smartAccountClient = await getAccountClientForSmartWallet(passportSigner) 
      
// //  // Function to get the smart account client
// //       const encodedFunctionData = encodeFunctionData({
// //       abi: ERC20_ABI,
// //         functionName: "transfer",
// //         args: [ msgSenderWalletAddress, BigInt(amountToSend * 10 ** 6)], // assuming USDC has 6 decimals
// //       });

  
  
// //       const response = await smartAccountClient.sendUserOperation({
// //         uo: {
// //           target: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
// //           data: encodedFunctionData,
// //           value: BigInt(0),
// //         },
// //       });
// //       if (response?.hash) {
// //         menu.con(`Transfer successful. Transaction hash: ${response.hash}. \n1. Back to main menu`);
// //       } else {
// //         menu.end("Failed to send USDC. Try again later.");
// //       }
  
// //     }else {     
// //       // const passportSigner = await createPassportSigner({ username: recipientAddress });
// //          const phoneNumber = menu.args.phoneNumber;         
// //       // const smartAccountClient = await getAccountClientForSmartWallet(passportSigner) 
// //       const passportSigner = await createPassportSigner({ username: phoneNumber });
                  
// //                       const smartAccountClient = await getAccountClientForSmartWallet(passportSigner) 

                 
// //  // Function to get the smart account client
// //       const encodedFunctionData = encodeFunctionData({
// //       abi: ERC20_ABI,
// //         functionName: "transfer",
// //         args: [ recipientAddress, BigInt(amountToSend * 10 ** 6)], // assuming USDC has 6 decimals
// //       });

  
  
// //          try{

// //           const response = await smartAccountClient.sendUserOperation({
// //             uo: {
// //               target: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
// //               data: encodedFunctionData,
// //               value: BigInt(0),
// //             },
// //           });
// //           if (response?.hash) {
// //             menu.con(`Transfer successful. Transaction hash: ${response.hash}. \n1. Back to main menu`);
// //           } else {
// //             menu.end("Failed to send USDC. Try again later.");
// //           }

// //          }catch(error){
// //           console.log(error, "error with regards to userOps")
        
// //          }
   
    
// //     }


 
// //   },
// //   next: {
// //     1: "mainMenu",
// //   },
// // });









// // offramp and withdraw
// menu.state("withdrawUSDcoins", {
//   run: () => {
//     menu.con("Enter amount in USDC to sell:");
//   },
//   next: {
//     "*\\d+$": "createOffRampQuote",
//   },
// });

// menu.state("createOffRampQuote", {
//   run: () => {
//     const dummyResponse = { success: true, data: { quoteId: "dummy_quote_id" } };
//     if (dummyResponse.success) {
//       menu.con(`Quote created successfully. Your quote ID is ${dummyResponse.data.quoteId}. \n1. Confirm Sale`);
//     } else {
//       menu.end("Failed to create quote. Try again later.");
//     }
//   },
//   next: {
//     1: "submitOffRampQuote",
//   },
// });

// menu.state("submitOffRampQuote", {
//   run: () => {
//     const dummyResponse = { success: true, data: { transactionId: "dummy_transaction_id" } };
//     if (dummyResponse.success) {
//       menu.con(`Sale successful. Your transaction ID is ${dummyResponse.data.transactionId}. \n1. Back to main menu`);
//     } else {
//       menu.end("Failed to submit quote. Try again later.");
//     }
//   },
//   next: {
//     1: "mainMenu",
//   },
// });






// // menu.state("sendOtherCurrencies", {
// //   run: () => {
// //     menu.con("Enter the symbol of the token you want to send:");
// //   },
// //   next: {
// //     "*^[A-Za-z0-9]{1,10}$": "enterRecipientAddress",
// //   },
// // });

// // menu.state("enterRecipientAddress", {
// //   run: () => {
// //     menu.con("Enter recipient's address / Telephone Number:");
// //   },
// //   next: {
// //     "*^0x[a-fA-F0-9]{40}$": "enterAmountToSendOther",
// //     "*\\d+$": "enterAmountToSendOther" // Allow phone numbers as well
// //   },
// // });

// // menu.state("enterAmountToSendOther", {
// //   run: () => {
// //     menu.con("Enter amount to send:");
// //   },
// //   next: {
// //     "*\\d+(\\.\\d+)?$": "checkOtherTokenBalance",
// //   },
// // });

// // menu.state("checkOtherTokenBalance", {
// //   run: () => {
// //     const dummyBalance = 1000;
// //     if (dummyBalance >= parseFloat(menu.val)) {
// //       menu.go("sendOtherCurrencyOperation");
// //     } else {
// //       menu.end("Insufficient balance to send token. Please try again.");
// //     }
// //   },
// // });

// // menu.state("sendOtherCurrencyOperation", {
// //   run: () => {
// //     const dummyResponse = { hash: "dummy_txn_hash" };
// //     if (dummyResponse.hash) {
// //       menu.con(`Transfer successful. Transaction hash: ${dummyResponse.hash}. \n1. Back to main menu`);
// //     } else {
// //       menu.end("Failed to send token. Please try again later.");
// //     }
// //   },
// //   next: {
// //     1: "mainMenu",
// //   },
// // });




// menu.state("susu", {
//   run: () => {
//     menu.con("Group Savings Options:\n1. Create Savings Group\n2. Join Savings Group\n3. Contribute to Group\n4. View Group Info");
//   },
//   next: {
//     1: "createSavingsGroup",
//     2: "joinSavingsGroup",
//     3: "contributeToGroup",
//     4: "viewGroupInfo",
//   }
// });





// // menu.state("Ezi Loan", {
// //   run: () => {
// //     menu.con("Choose Group type. \n1. Create Savings Cycle \n2. Join Saving Cycle");
// //   },
// //   next: {
// //     1: "Rolling_Savings",
// //     2: "Target_Savings"
// //   }
// // });

// // menu.state("Rolling_Savings", {
// //   run: () => {
// //     menu.con("Enter Contribution amount. eg: 50 is 50 ghana cedi ");
// //   },
// //   next: {
// //     "*\\d+(\\.\\d+)?$": "frequency",
// //   }
// // });

// // menu.state("frequency", {
// //   run: () => {
// //     menu.con("Choose contribution frequency. \n1. Daily \n2. Weekly \n3. Monthly ");
// //   },
// //   next: {
// //     1: "max_members",
// //     2: "max_members",
// //     3: "max_members"
// //   }
// // });

// // menu.state("max_members", {
// //   run: () => {
// //     menu.con("Choose number of members. \n Minimum is 3 people ");
// //   },
// //   next: {
// //     "*\\d+(\\.\\d+)?$": "group_name",
// //   }
// // });

// // menu.state("group_name", {
// //   run: () => {
// //     menu.con("Enter Group Name.");
// //   },
// //   next: {
// //     "*[A-Za-z0-9 ]+$": "successfully_created",
// //   }
// // });

// // menu.state("successfully_created", {
// //   run: () => {
// //     menu.end(`Group created share group number to add other members \n\n Group name: ${menu.val} \n Group Id: 4 \n Group contribution: 90 \n Number of People In Group: 8`);
// //   },
// // });

// // menu.state("Target_Savings", {
// //   run: () => {
// //     menu.con("Enter Group Id ");
// //   },
// //   next: {
// //     "*\\d+$": "authorize_payment"
// //   }
// // });

// // menu.state("authorize_payment", {
// //   run: () => {
// //     menu.con("Enter amount and authorize payment to join group");
// //   },
// //   next: {
// //     "*\\d+(\\.\\d+)?$": "succesful_joining_group"
// //   }
// // });

// // menu.state("succesful_joining_group", {
// //   run: () => {
// //     menu.end("Successfully invested");
// //   }
// // });






















// menu.state("checkBalance", {
//   run: async () => {


//     menu.con("Balance of User  \n1. USDcoins  \n2.Other Crypto ")
//   }, 
//   next:{
//     1:"USDC_Balance", 
//     "*[A-Za-z0-9 ]+$":"Other_Balance"
//   }
// })



// menu.state("USDC_Balance", {
//   run:async()=>{
//          const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber);
//          const address = walletSmartAddress?.smartContractWallet!
//     const tokenAddresses = await fetchTokenAddresses() as TokenType;
//      console.log(address)
//     if (!walletSmartAddress) {
//       menu.end("Failed to retrieve wallet address. Try again later.");
//     }
   
//     const getUscObject = tokenAddresses.find((value)=> value.symbol =="USDC")!
//       const balance = await getTokenBalance(address, getUscObject.address) as ethers.BigNumberish
//       const formattedBalance = ethers.utils.formatUnits(balance, getUscObject.decimals);
//       const balanceToShow = ethers.BigNumber.from(balance).gt(0) ? formattedBalance : "0";


//       menu.end(`$${getUscObject.name}: ${balanceToShow}`);    
//   }, 

// })


// menu.state("Other_Balance", {
//   run:async()=>{
//     const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber);
//     const address = walletSmartAddress?.smartContractWallet!
// const tokenAddresses = await fetchTokenAddresses() as TokenType;
// console.log(tokenAddresses)
// if (!walletSmartAddress) {
//  menu.end("Failed to retrieve wallet address. Try again later.");
// }

// // const getUscObject = tokenAddresses.find((value)=> value.symbol ==menu.val.trim())!
// // const balance = await getTokenBalance(walletSmartAddress?.smartContractWallet!, getUscObject.address) as ethers.BigNumberish
// // const formattedBalance = ethers.utils.formatUnits(balance, getUscObject.decimals);
// // const balanceToShow = ethers.BigNumber.from(balance).gt(0) ? formattedBalance : "0";
// const btcBalance = await getbalance("n2CBJ4s4NQcpUMnW3iimfVtjUqgzHPuA41") 
// console.log(btcBalance, 'btcBalance')

// // menu.end(`$${getUscObject.name}: ${balanceToShow}}`);  
// menu.end(`List of other currencies : \n BTC :${btcBalance / (10 ** 8)}`)  
//   }, 
 
// })







// }



export default (menu: UssdMenu, sessions: Sessions) => {
  menu.state("main menu", {
    run: async () => {
      const sessionId: string = menu.args.sessionId;
      if (!sessionId) {
        menu.end("Session expired. Please try again.");
        return;
      }
      if (!sessions[sessionId]) {
        sessions[sessionId] = {};
      }
      menu.con(`Shika Wallet Services
        1. Money In
        2. Send Money To Another
        3. Money Out
        4. Susu Savings
        5. Get Wallet Address 
        6. Check Balance
      `);
    },
    next: {
      1: "buyUSDcoins",
      2: "sendUSDcoins",
      3: "withdrawUSDcoins",
      4: "susu",
      5: "getWalletAddress",
      6: "checkBalance",
    }
  });


    /////////////////////////
  ////  BUY USDC /////////
  /////////////////////////

  menu.state("buyUSDcoins", {
    run: () => {
      menu.con("Enter amount in GHS to buy USDC:");
    },
    next: {
      "*\\d+$": "createOnRampQuote",
    },
  });

  menu.state("createOnRampQuote", {
    run: async () => {
      const sessionId: string = menu.args.sessionId;
      if (!sessionId) {
        menu.end("Session expired. Please try again.");
        return;
      }
      if (!sessions[sessionId]) {
        sessions[sessionId] = {};
      }
      const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber);
      if (!walletSmartAddress?.smartContractWallet) {
        menu.end("Failed to retrieve wallet address. Try again later.");
        return;
      }
      const fiatAmount = menu.val;
      const phoneNumber = menu.args.phoneNumber;
      const requestData = {
        customer: {
          phoneNumber: phoneNumber,
          accountName: "kwame",
          network: "MTN",
        },
        fiatAmount: parseFloat(fiatAmount),
        fiatCurrency: "GHS",
        chain: "ARBITRUM",
        token: "USDC",
        receiverAddress: walletSmartAddress.smartContractWallet,
      };

      const response = await createOnRampQuote(requestData);

      if (response && response.success) {
        const quoteId = response && response.data && response.data.quoteId;
        const rate = response && response.data && response.data.rate;
        sessions[sessionId]!.createOnRampquoteId = quoteId;
        
        menu.con(`Quote Submission Rate: ${rate.value}\n1. Confirm Purchase`);
      } else {
        menu.end("Failed to create quote. Try again later.");
      }
    },
    next: {
      1: "submitOnRampQuote",
    },
  });
  menu.state("submitOnRampQuote", {
    run: async () => {
      const sessionId: string = menu.args.sessionId;
      if (!sessionId) {
        menu.end("Session expired. Please try again.");
        return;
      }
      if (!sessions[sessionId]) {
        sessions[sessionId] = {};
      }
  
      try {
        const quoteId = sessions[sessionId]!.createOnRampquoteId;
        console.log(quoteId, "before we submit this is the quote");
        
        const response = await submitOnRampQuote(quoteId) as unknown as SubmitQuoteOnRampResponse;
        console.log(response, 'response for onramp');
  
        if (response && response.success) {
          menu.end(`Purchase successful. Your transaction ID is ${response.data.transactionId}. \n1. Back to main menu`);
        } else {
          menu.end("Failed to submit quote. Try again later.");
        }
        
      } catch (error) {
        console.error("Error submitting on-ramp quote:", error);
  
        // Assuming any error here is a network-related issue
        menu.end("Network error occurred. Please check your connection and try again.");
      }
    },
  });
  

  // menu.state("submitOnRampQuote", {
  //   run: async () => {
  //     const sessionId: string = menu.args.sessionId;
  //     if (!sessionId) {
  //       menu.end("Session expired. Please try again.");
  //       return;
  //     }
  //     if (!sessions[sessionId]) {
  //       sessions[sessionId] = {};
  //     }
  //     const quoteId = sessions[sessionId]!.createOnRampquoteId;
  //     console.log(quoteId, "before we submit this is the quote");
  //     const response = await submitOnRampQuote(quoteId) as unknown as SubmitQuoteOnRampResponse;
  //     console.log(response, 'response for onramp');
  //     if (response && response?.success) {
  //       menu.end(`Purchase successful. Your transaction ID is ${response?.data?.transactionId}. \n1. Back to main menu`);
  //     } else {
  //       menu.end("Failed to submit quote. Try again later.");
  //     }
  //   },
  // });




  /////////////////////////
  ////  SEND USDC /////////
  /////////////////////////

  menu.state("sendUSDcoins", {
    run: () => {
      menu.con("Enter recipient's address / Telephone Number:");
    },
    next: {
      "*^0x[a-fA-F0-9]{40}$": "enterAmountToSend",
    },
  });

  menu.state("enterAmountToSend", {
    run: () => {
      const sessionId = menu.args.sessionId;
      if (!sessionId) {
        menu.end("Session expired. Please try again.");
        return;
      }
      if(!sessions[sessionId]){
        sessions[sessionId] = {};
      }

      sessions[sessionId]!.recipient = menu.val;
      menu.con("Enter amount in USDC to send:");
    },
    next: {
      "*\\d+(\\.\\d+)?$": "sendUSDCOperation",
    },
  });

  menu.state("sendUSDCOperation", {
    run: async () => {
      const sessionId = menu.args.sessionId;
      if (!sessionId) {
        menu.end("Session expired. Please try again.");
        return;
      }

      const recipientAddress = sessions[sessionId]?.recipient;
      const amountToSend = parseInt(menu.val);

      if (!recipientAddress || isNaN(amountToSend)) {
        menu.end("Invalid recipient or amount. Please try again.");
        return;
      }

      try {
        let msgSenderWalletAddress;
        if (recipientAddress.slice(0, 2) !== "0x") {
          const walletSmartAddress = await getUserByPhoneNumber(recipientAddress);
          const address = walletSmartAddress?.smartContractWallet!;
          
          const tokenAddresses = await fetchTokenAddresses() as TokenType;
          const getUscObject = tokenAddresses.find((value) => value.symbol == "USDC")!;
          const balance = await getTokenBalance(address, getUscObject.address) as ethers.BigNumberish;
          const formattedBalance = ethers.utils.formatUnits(balance, getUscObject.decimals);
          const balanceToShow = ethers.BigNumber.from(formattedBalance).gt(0) ? true : false;
          if(balanceToShow === false){
            menu.end("Not enough money in wallet");
          }
          if (!walletSmartAddress?.smartContractWallet) {
            menu.end("Recipient's wallet address not found. Please check the phone number and try again.");
            return;
          }
        } else {
          msgSenderWalletAddress = recipientAddress as `0x${string}`;
        }

        const phoneNumber = menu.args.phoneNumber;
        const passportSigner = await createPassportSigner({ username: phoneNumber });
        if (!passportSigner) {
          menu.end("Failed to create passport signer. Please try again later.");
          return;
        }

        const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
        if (!smartAccountClient) {
          menu.end("Failed to get smart account client. Please try again later.");
          return;
        }

        const encodedFunctionData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [msgSenderWalletAddress, BigInt(amountToSend * 10 ** 6)],
        });

        const response = await smartAccountClient.sendUserOperation({
          uo: {
            target: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
            data: encodedFunctionData,
            value: BigInt(0),
          },
        });

        console.log(response, "response");

        if (response?.hash) {
          menu.end(`Transfer successful. Transaction hash: ${response.hash}.`);
        } else {
          menu.end("Transfer failed. No transaction hash received. Please try again later.");
        }
      } catch (error) {
        console.error("Error in sendUSDCOperation:", error);
        if (error instanceof Error) {
          if (error.message.includes("insufficient balance")) {
            menu.end("Insufficient balance to complete the transfer. Please check your balance and try again.");
          } else if (error.message.includes("gas")) {
            menu.end("Not enough gas to complete the transaction. Please try again later or with a smaller amount.");
          } else {
            menu.end(`An error occurred: ${error.message}. Please try again later.`);
          }
        } else {
          menu.end("An unknown error occurred. Please try again later.");
        }
      }
    },
  });




    /////////////////////////
  ////  OFFRAMP USDC /////////
  /////////////////////////
  menu.state("withdrawUSDcoins", {
    run: () => {
      menu.con("Enter amount in USDC to sell:");
    },
    next: {
      "*\\d+$": "createOffRampQuote",
    },
  });

  menu.state("createOffRampQuote", {
    run: () => {
      const dummyResponse = { success: true, data: { quoteId: "dummy_quote_id" } };
      if (dummyResponse.success) {
        menu.con(`Quote created successfully. Your quote ID is ${dummyResponse.data.quoteId}. \n1. Confirm Sale`);
      } else {
        menu.end("Failed to create quote. Try again later.");
      }
    },
    next: {
      1: "submitOffRampQuote",
    },
  });

  // menu.state("submitOffRampQuote", {
  //   run: () => {
  //     const dummyResponse = { success: true, data: { transactionId: "dummy_transaction_id" } };
  //     if (dummyResponse.success) {
  //       menu.con(`Sale successful. Your transaction ID is ${dummyResponse.data.transactionId}. \n1. Back to main menu`);
  //     } else {
  //       menu.end("Failed to submit quote. Try again later.");
  //     }
  //   },
  //   next: {
  //     1: "mainMenu",
  //   },
  // });



    /////////////////////////
  ////  SUSU /////////
  /////////////////////////
  
menu.state("susu", {
  run: () => {
    menu.con("Group Savings Options:\n1. Create Savings Group\n2. Join Savings Group\n3. Contribute to Group\n4. View Group Info");
  },
  next: {
    1: "createSavingsGroup",
    2: "joinSavingsGroup",
    3: "contributeToGroup",
    4: "viewGroupInfo",
  }
});



////////////////////
///////CREATING THE SAVINGS-GROUP////////
////////////////////////////////////////




// menu.state("createSavingsGroup", {
//   run: () => {
//     menu.con("Enter group name:");
//   },
//   next: {
//     "*[A-Za-z0-9 ]+$": "setGroupTarget",
//   }
// });

// menu.state("setGroupTarget", {
//   run: () => {
//     const sessionId = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//     }
//     if(!sessions[sessionId]){
//       sessions[sessionId] = {};
//     }
//     sessions[menu.args.sessionId]!.groupName =  menu.val ;
//     menu.con("Enter savings target amount in USDC:");
//   },
//   next: {
//     "*\\d+(\\.\\d+)?$": "setGroupDuration",
//   }
// });

// menu.state("setGroupDuration", {
//   run: () => {
    
//     const sessionId: string = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//     }
//     if (!sessions[sessionId]) {
//       sessions[sessionId] = {};
//     }
//     sessions[sessionId].targetAmount = menu.val;
//     menu.con("Enter savings duration in days:");
//   },
//   next: {
//     "*\\d+$": "confirmGroupCreation",
//   }
// });

// menu.state("confirmGroupCreation", {
//   run: () => {
    
//     const sessionId = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//     }
//     if(!sessions[sessionId]){
//       sessions[sessionId] = {};
//     }

 
//     const groupName = sessions[sessionId].groupName;
//     const targetAmount = sessions[sessionId].targetAmount;

   
//     const duration = parseInt(menu.val);
//     menu.end(`Group "${groupName}" created with target ${targetAmount} USDC for ${duration} days.`);
//   }
// });



menu.state("createSavingsGroup", {
  run: () => {
    menu.con("Enter group name:");
  },
  next: {
    "*[A-Za-z0-9 ]+$": "setGroupTarget",
  }
});

menu.state("setGroupTarget", {
  run: () => {
    const sessionId = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if (!sessions[sessionId]) {
      sessions[sessionId] = {};
    }

    sessions[sessionId]!.groupName = menu.val; // Save group name
    menu.con("Enter savings target amount in USDC:");
  },
  next: {
    "*\\d+(\\.\\d+)?$": "setGroupDuration",
  }
});

menu.state("setGroupDuration", {
  run: () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }

    sessions[sessionId].targetAmount = menu.val; // Save target amount
    menu.con("Enter savings duration in days:");
  },
  next: {
    "*\\d+$": "setParticipantCount",
  }
});

menu.state("setParticipantCount", {
  run: () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }

    sessions[sessionId].duration = parseInt(menu.val); // Save duration
    menu.con("Enter number of participants:");
  },
  next: {
    "*\\d+$": "setCollateralRequirement",
  }
});

menu.state("setCollateralRequirement", {
  run: () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }

    sessions[sessionId].participantCount = parseInt(menu.val); // Save participant count
    menu.con("Require collateral? (1 for Yes, 0 for No):");
  },
  next: {
    "1": "enterCollateralAmount",
    "0": "confirmGroupCreationOnBlockchain",
  }
});

menu.state("enterCollateralAmount", {
  run: () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }
    sessions[sessionId].requireCollateral = true; // Set collateral requirement
    menu.con("Enter collateral amount in USDC:");
  },
  next: {
    "*\\d+(\\.\\d+)?$": "confirmGroupCreationOnBlockchain",
  }
});

menu.state("confirmGroupCreationOnBlockchain", {
  run: async () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }

    const groupName = sessions[sessionId].groupName;
    const targetAmount = BigInt(sessions[sessionId].targetAmount);
    const duration = BigInt(sessions[sessionId].duration);
    const participantCount = BigInt(sessions[sessionId].participantCount);
    const requireCollateral = sessions[sessionId].requireCollateral;
    const collateralAmount = requireCollateral ? BigInt(sessions[sessionId].collateralAmount) : BigInt(0);
    const usdcTokenAddress = "0x8685c6Bc85Aad6e97d5735E5217efA729A874873"; 
    const creditManagerAddress = "0xbb04e4A7738fA1Ca72b131D6EC03Dc7e9AF42631"; // Credit manager contract address
    // const adminWalletAddress = "0xYourAdminWalletAddress"; // Admin wallet address
    const factoryAddress = "0x81E24aE451D5E453D5570B8d752F5A9ACb20ca93"; // Savings pool factory address
    const creationFee = BigInt(0); // Example creation fee

    try {
      const passportSigner = await createPassportSigner({ username: menu.args.phoneNumber });

      const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);

      const adminWalletAddress = await smartAccountClient.getAddress();
      const result = await createNewSavingsPool(
        passportSigner,
        factoryAddress as Hex,
        groupName,
        targetAmount,
        duration,
        participantCount,
        requireCollateral,
        collateralAmount,
        usdcTokenAddress as Hex,
        creditManagerAddress as Hex,
        adminWalletAddress as Hex,
        creationFee
      );

      if (result) {
        menu.end(`Savings pool created successfully! Pool ID: ${result.poolId}, Address: ${result.poolAddress}`);
      } else {
        menu.end("Failed to create savings pool. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating savings pool:", error);
      menu.end("An error occurred while creating the savings pool. Please try again later.");
    }
  }
});










menu.state("joinSavingsGroup", {
  run: () => {
    menu.con("Enter group ID to join:");
  },
  next: {
    "*\\d+$": "enterContributionAmount",
  }
});

// menu.state("confirmJoinGroup", {
//   run: () => {
//     const groupId = parseInt(menu.val);
//     menu.end(`Successfully joined group ${groupId}!`);
//   }
// });






////////////////
///CONTRIBUTE TO GROUP ///////
////////////////////////////


// menu.state("contributeToGroup", {
//   run: () => {
//     menu.con("Enter group ID to contribute to:");
//   },
//   next: {
//     "*\\d+$": "enterContributionAmount",
//   }
// });

// menu.state("enterContributionAmount", {
//   run: () => {
//     const sessionId = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//     }
//     if(!sessions[sessionId]){
//       sessions[sessionId] = {};
//     }

   
//     sessions[sessionId].groupId = parseInt(menu.val);
//     menu.con("Enter contribution amount in USDC:");
//   },
//   next: {
//     "*\\d+(\\.\\d+)?$": "confirmContribution",
//   }
// });

// menu.state("confirmContribution", {
//   run: () => {
//     const sessionId = menu.args.sessionId;
//     if (!sessionId) {
//       menu.end("Session expired. Please try again.");
//       return;
//     }
//     if(!sessions[sessionId]){
//       sessions[sessionId] = {};
//     }

 
//     const groupId = sessions[sessionId].groupId;
//     const amount = parseFloat(menu.val);
//     menu.end(`Contributed ${amount} USDC to group ${groupId} successfully!`);
//   }
// });

menu.state("contributeToGroup", {
  run: () => {
    menu.con("Enter group ID to contribute to:");
  },
  next: {
    "*\\d+$": "enterContributionAmount",
  }
});

menu.state("enterContributionAmount", {
  run: () => {
    const sessionId = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    
    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }

    sessions[sessionId].groupId = menu.val; // Save group ID
    menu.con("Enter contribution amount in USDC:");
  },
  next: {
    "*\\d+(\\.\\d+)?$": "confirmContributionOnBlockchain",
  }
});

menu.state("confirmContributionOnBlockchain", {
  run: async () => {
    const sessionId = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }

    if(!sessions[sessionId]){
      sessions[sessionId] = {};
    }
    const groupId = sessions[sessionId].groupId as string;
    const amount = BigInt(menu.val);

    try {
      const passportSigner = await createPassportSigner({ username: menu.args.phoneNumber });
      const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber);

      if (!walletSmartAddress?.smartContractWallet) {
        menu.end("Failed to retrieve wallet address. Try again later.");
        return;
      }

      const savingsPoolAddress = groupId as `0x${string}`;
      const userAddress = walletSmartAddress.smartContractWallet as `0x${string}`;

      const txHash = await contributeToPool(passportSigner, savingsPoolAddress, userAddress, amount);

      if (txHash) {
        menu.end(`Contribution successful. Transaction Hash: ${txHash}`);
      } else {
        menu.end("Failed to contribute to the pool. Please try again later.");
      }
    } catch (error) {
      console.error("Error contributing to the pool:", error);
      menu.end("An error occurred while contributing. Please try again later.");
    }
  }
});













menu.state("viewGroupInfo", {
  run: () => {
    menu.con("Enter group ID to view info:");
  },
  next: {
    "*\\d+$": "displayGroupInfo",
  }
});

menu.state("displayGroupInfo", {
  run: () => {
    const groupId = parseInt(menu.val);
    const dummyInfo = `
Group Name: SavingsGroup${groupId}
Target Amount: 1000 USDC
Current Amount: 500 USDC
Member Count: 5
End Date: 2024-12-31
    `;
    menu.end(dummyInfo);
  }
});







///////////////////////////
//////GET BALANCE ////
//////////////////////////

menu.state("checkBalance", {
  run: async () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if (!sessions[sessionId]) {
      sessions[sessionId] = {};
    }

    // Prompt user to check USDC balance
    menu.con("Check Balance:\n1. USDcoins (USDC)\n");
  },
  next: {
    1: "USDC_Balance",
  }
});

menu.state("USDC_Balance", {
  run: async () => {
    const sessionId: string = menu.args.sessionId;
    if (!sessionId) {
      menu.end("Session expired. Please try again.");
      return;
    }
    if (!sessions[sessionId]) {
      sessions[sessionId] = {};
    }

    try {
      const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber);
      
      // Ensure wallet address is fetched
      if (!walletSmartAddress || !walletSmartAddress.smartContractWallet) {
        menu.end("Failed to retrieve wallet address. Try again later.");
        return;
      }

      const address = walletSmartAddress.smartContractWallet;

      // Fetch token addresses to find USDC
      const tokenAddresses = await fetchTokenAddresses() as TokenType;
      const usdcToken = tokenAddresses.find((value) => value.symbol === "MUSDC");

      // Check if USDC token address was found
      if (!usdcToken) {
        menu.end("USDC token address not found. Please try again later.");
        return;
      }

      // Fetch USDC balance
      const balance = await getTokenBalance(address, usdcToken.address) as ethers.BigNumberish;
      const formattedBalance = ethers.utils.formatUnits(balance, usdcToken.decimals);
      const balanceToShow = ethers.BigNumber.from(balance).gt(0) ? formattedBalance : "0";

      // Display balance
      menu.end(`Your USDC Balance: ${balanceToShow} USDC`);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      menu.end("An error occurred while retrieving balance. Please try again later.");
    }
  },
});










///////////////////////////
//////GET ADDRESS ////
//////////////////////////
menu.state("getWalletAddress", {
  run: async () => {
    const walletSmartAddress = await getUserByPhoneNumber(menu.args.phoneNumber);
    if (walletSmartAddress) {
      const firstPart = walletSmartAddress.smartContractWallet.slice(0, 25);
      const secondPart = walletSmartAddress.smartContractWallet.slice(25, 50);
      const thirdPart = walletSmartAddress.smartContractWallet.slice(50);
  
      menu.end(`Your wallet address is \n ${firstPart}\n${secondPart}\n${thirdPart}.\n \n `);
    } else {
      menu.end("Failed to retrieve wallet address. Try again later.");
    }
  },

});
 

 
};