import { usdcToBtcSwapAbi } from "../abi/usdcToBtcSwapAbi.js";
import { encodeFunctionData, Hex, keccak256, toBytes , Abi, decodeEventLog} from 'viem'
import { ethers } from "ethers";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { ERC20_ABI } from "../abi/ERC20Factory.js";
import {CreditManager_ABI} from "../abi/CreditManagerAbi.js";
import {SavingsPool_Abi} from "../abi/SavingsPoolAbi.js";
import {UserRegistry_ABI} from "../abi/UserRegistryAbi.js";
import { PassportSigner } from "@0xpass/alchemy-signer";
import { createPassportSigner, getAccountClientForSmartWallet } from "@/utils/passport/passport.js";
import { menu } from "@/helpers/menu/index.js";
import UssdMenu from "ussd-builder";
import axios from "axios";
import { broadcastTransaction, calculateExchangeRate } from "./bitcoinWallet.js";
import {
    SwapSDK,
    QuoteResponse,
    Chains, Assets ,
    DepositAddressResponse,
    QuoteRequest,
  } from "@chainflip/sdk/swap";
import bitcore, { Address } from "bitcore-lib";
import { GroupPoolFactory_ABI } from "../abi/GroupSavingsFactoryAbi.js";
export const swapSDK = new SwapSDK({ network: "perseverance" });


const TESTNET = true;

type SatoshiInput = {
  satoshis: number;
  script: string;
  address: Address;
  txid: string;
  outputIndex: number;
};

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

interface Transaction {
  txid: string;
  vout: number;
  status: TransactionStatus;
  value: number;
}



async function performTokenSwap(
    passportSigner: PassportSigner,
    amount: bigint,
    dstAddress: string,
   
  ) {
    const tokenAddress = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; // USDC testnet address
    const contractAddress = "0x30954C2c5b9B065eb195E0Cb32EB9710104dD4e4";
    
    try {
      const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
      // if (!smartAccountClient) {
      //   return "Failed";
      // }
  
      // Encode the approval function
      const approveEncodedFunction = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contractAddress, amount],
      });
  
      // Encode the swap function
      const dstChain = 3; // Example chain ID
      const dstToken = 5; // BTC token ID
      const cfParameters = ethers.utils.formatBytes32String(""); // Custom parameters, empty in this case
  
      const swapEncodedFunction = encodeFunctionData({
        abi: usdcToBtcSwapAbi,
        functionName: "xSwapToken",
        args: [dstChain, dstAddress, dstToken, amount, cfParameters],
      });
  
      // Create a batch of transactions
      const userOp = await smartAccountClient.sendUserOperation({
        uo: [
          {
            target: tokenAddress,
            data: approveEncodedFunction,
            value: BigInt(0),
          },
          {
            target: contractAddress,
            data: swapEncodedFunction,
            value: BigInt(0),
          },
        ],
      });
       
      const txHash= await smartAccountClient.waitForUserOperationTransaction(userOp);
      return txHash;
      // const userOpReceipt = await smartAccountClient.getUserOperationReceipt(
      //   userOp.hash as `0x${string}`
      // );
    
      // console.log("\nUser operation receipt: ", userOpReceipt);
    
      // const txReceipt = await smartAccountClient.waitForTransactionReceipt({
      //   hash: txHash,
      // });

      // const hash = txReceipt.transactionHash
      // console.log("\n\n",txReceipt.transactionHash, 'TXRECEIPT')
     
    } catch (error) {
      console.error("Error executing token swap:", error);
      // throw error;
    }
}



function convertPinToHex(pin: string): Hex {
  // Ensure the PIN is a string and pad it to at least 4 characters
  const paddedPin = pin.toString().padStart(4, '0');
  
  // Hash the padded PIN to get a 32-byte value
  const hashedPin = keccak256(toBytes(paddedPin));
  
  return hashedPin;
}



async function registerUserToRegistry(
  passportSigner: PassportSigner,
  id: string,
  firstName: string,
  lastName: string,
  pinCode: string,
  telNumber: bigint
) {
  const contractAddress = "0x9BA065a08e9e79643b1FBfECAD6053876714faA1"; // Replace with actual UserRegistry contract address

  try {
    const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);

    // Encode the registerUser function
    const registerUserEncodedFunction = encodeFunctionData({
      abi: UserRegistry_ABI,
      functionName: "registerUser",
      args: [id, firstName, lastName, convertPinToHex(pinCode), telNumber],
    });

    // Create and send the user operation
    const userOp = await smartAccountClient.sendUserOperation({
      uo: [
        {
          target: contractAddress,
          data: registerUserEncodedFunction,
          value: BigInt(0),
        },
      ],
    });

    // Wait for the transaction to be mined
    const txHash = await smartAccountClient.waitForUserOperationTransaction(userOp);
    
    console.log("User registered successfully. Transaction hash:", txHash);
    return txHash;

  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}


/**
 * Function to contribute USDC to the Savings Pool.
 * @param passportSigner - The passport signer associated with the user's account.
 * @param savingsPoolAddress - The address of the Savings Pool contract.
 * @param userAddress - The address of the user contributing.
 * @param amount - The amount of USDC to contribute.
 * @returns The transaction hash if successful.
 */
async function contributeToPool(
  
  passportSigner: PassportSigner,
  savingsPoolAddress: `0x${string}`,
  userAddress: `0x${string}`,
  amount: bigint
) {
  try {
    const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
    
    // Encode the approval function to approve USDC spending
    const approveEncodedFunction = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "approve",
      args: [savingsPoolAddress, amount],
    });

    // Encode the contribute function to contribute USDC to the pool
    const contributeEncodedFunction = encodeFunctionData({
      abi: SavingsPool_Abi,
      functionName: "contribute",
      args: [userAddress, amount],
    });

    // Create a batch of transactions "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"  
    const userOp = await smartAccountClient.sendUserOperation({
      uo: [
        {
          target:"0x8685c6Bc85Aad6e97d5735E5217efA729A874873" , // USDC token contract address
          data: approveEncodedFunction,
          value: BigInt(0),
        },
        {
          target: savingsPoolAddress,
          data: contributeEncodedFunction,
          value: BigInt(0),
        },
      ],
    });

    // Wait for the transaction to be mined
    const txHash = await smartAccountClient.waitForUserOperationTransaction(userOp);
    console.log("Contribution successful. Transaction hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error contributing to the pool:", error);
    throw error;
  }
}

/**
 * Function to vote for a recipient in the Savings Pool.
 * @param passportSigner - The passport signer associated with the user's account.
 * @param savingsPoolAddress - The address of the Savings Pool contract.
 * @param voteChoice - The user's vote choice (YES or NO).
 * @returns The transaction hash if successful.
 */
async function voteOnRecipient(
  passportSigner: PassportSigner,
  savingsPoolAddress: string,
  voteChoice: number
) {
  try {
    const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);

    // Encode the voteOnRecipient function
    const voteEncodedFunction = encodeFunctionData({
      abi: SavingsPool_Abi,
      functionName: "voteOnRecipient",
      args: [voteChoice],
    });

    // Send the user operation
    const userOp = await smartAccountClient.sendUserOperation({
      uo: [
        {
          target: savingsPoolAddress,
          data: voteEncodedFunction,
          value: BigInt(0),
        },
      ],
    });

    // Wait for the transaction to be mined
    const txHash = await smartAccountClient.waitForUserOperationTransaction(userOp);
    console.log("Voting successful. Transaction hash:", txHash);
    return txHash;
  } catch (error) {
    console.error("Error voting on recipient:", error);
    throw error;
  }
}

// Example usage
// const passportSigner = ...; // Initialize your PassportSigner
// await registerUser(passportSigner, "user123", "John", "Doe", "0x1234.


 



async function createNewSavingsPool(
  passportSigner: PassportSigner,
  factoryAddress: Hex,
  name: string,
  groupTargetAmount: bigint,
  groupDuration: bigint,
  groupParticipantCount: bigint,
  requireCollateral: boolean,
  collateralAmount: bigint,
  usdcTokenAddress: Hex,
  creditManagerAddress: Hex,
  adminWalletAddress: Hex,
  creationFee: bigint
) {
  try {
    const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);

    // Encode the createSavingsPool function
    const createSavingsPoolEncodedFunction = encodeFunctionData({
      abi: GroupPoolFactory_ABI,
      functionName: "createSavingsPool",
      args: [
        name,
        groupTargetAmount,
        groupDuration,
        groupParticipantCount,
        requireCollateral,
        collateralAmount,
        usdcTokenAddress,
        creditManagerAddress,
        adminWalletAddress
      ],
    });

    // Create and send the user operation
    const userOp = await smartAccountClient.sendUserOperation({
      uo: [
        {
          target: factoryAddress,
          data: createSavingsPoolEncodedFunction,
          value: creationFee, // Pass the creation fee
        },
      ],
    });

    // Wait for the transaction to be mined
    const txHash = await smartAccountClient.waitForUserOperationTransaction(userOp);
    
    console.log("Savings Pool creation transaction hash:", txHash);

    // Get the transaction receipt to find the emitted event
    const txReceipt = await smartAccountClient.getTransactionReceipt({ hash: txHash });

    // Find the SavingsPoolCreated event in the logs
    const savingsPoolCreatedEvent = txReceipt.logs.find(log => {
      try {
        const decodedLog = decodeEventLog({
          abi: GroupPoolFactory_ABI as Abi,
          data: log.data,
          topics: log.topics,
        });
        return decodedLog.eventName === 'SavingsPoolCreated';
      } catch {
        return false;
      }
    });

    if (savingsPoolCreatedEvent) {
    

      const poolId = savingsPoolCreatedEvent?.args?.poolId as bigint;
      const poolAddress = savingsPoolCreatedEvent?.args?.poolAddress as Hex;

      console.log("New Savings Pool created:");
      console.log("Pool ID:", poolId.toString());
      console.log("Pool Address:", poolAddress);
      return { poolId, poolAddress };
    } else {
      console.log("Savings Pool created, but couldn't find the event in the logs.");
      return null;
    }

  } catch (error) {
    console.error("Error creating new savings pool:", error);
    throw error;
  }
}




// Example usage remains the same


// Example usage
// const passportSigner = ...; // Initialize your PassportSigner
// const factoryAddress = "0x..." as Hex; // GroupPoolFactory contract address
// const creationFee = parseEther("0.1"); // Adjust based on the current creation fee

// await createNewSavingsPool(
//   passportSigner,
//   factoryAddress,
//   "My Savings Pool",
//   BigInt(1000000), // groupTargetAmount (in smallest unit, e.g., wei)
//   BigInt(30 * 24 * 60 * 60), // groupDuration (in seconds, e.g., 30 days)
//   BigInt(10), // groupParticipantCount
//   true, // requireCollateral
//   BigInt(100000), // collateralAmount (in smallest unit)
//   "0x..." as Hex, // usdcTokenAddress
//   "0x..." as Hex, // creditManagerAddress
//   "0x..." as Hex, // adminWalletAddress
//   creationFee
// );

const sendBitcoin = async (recieverAddress: string,amountToSend: string) => {
    try {
      const privateKey ="95e35d43772c3131f4059beae194708abfa5cfb4cd4c2ef31f76378bd641d4a0";
      const sourceAddress ="n2CBJ4s4NQcpUMnW3iimfVtjUqgzHPuA41" as unknown as Address;
      const satoshiToSend = parseInt(amountToSend);
      let fee = 0;
      let inputCount = 0;
      let outputCount = 2;
  
      // const recommendedFee = await axios.get(
      //   "https://bitcoinfees.earn.com/api/v1/fees/recommended",
      // );
      // console.log(recommendedFee, "recommendFeed")
  
      const transaction = new bitcore.Transaction();
      let totalAmountAvailable = 0;
  
      let inputs :SatoshiInput[]= [];
  
      const resp = await axios({
        method: "GET",
        url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
      });
  
      const utxos = resp.data as Transaction[];
  
      for (const utxo of utxos) {
        const input: SatoshiInput = {
          satoshis: utxo.value,
          script: bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex(),
          address: sourceAddress,
          txid: utxo.txid,
          outputIndex: utxo.vout,
        };
        totalAmountAvailable += utxo.value;
        inputCount += 1;
        inputs.push(input);
      }
      console.log(totalAmountAvailable, "response");
      console.log(satoshiToSend, "response");
      // /**
      //  * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
      //  * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
      //  * from the transaction as well.
      //  * */
  
      const transactionSize =
        inputCount * 180 + outputCount * 34 + 10 - inputCount;
  
      fee = transactionSize * 1; // satoshi per byte
      console.log(totalAmountAvailable, "response");
      console.log(satoshiToSend, "response");
      console.log(totalAmountAvailable - satoshiToSend - fee);
      if (TESTNET) {
        fee = transactionSize * 1; // 1 sat/byte is fine for testnet
      }
      if (totalAmountAvailable - satoshiToSend - fee < 0) {
        throw new Error("Balance is too low for this transaction");
      }
      // //Set transaction input
      // Convert SatoshiInput to UnspentOutput
      const unspentOutputs = inputs.map(
        (input) =>
          new bitcore.Transaction.UnspentOutput({
            txId: input.txid,
            outputIndex: input.outputIndex,
            address: input.address,
            script: input.script,
            satoshis: input.satoshis,
          }),
      );
  
      transaction.from(unspentOutputs);
  
      // // set the recieving address and the amount to send
      transaction.to(recieverAddress, satoshiToSend);
  
      // // Set change address - Address to receive the left over funds after transfer
      const changeAddress = "n3xbJdgzN6L28Gq8Q5dsRhwBkRWVe7e1S9";
      transaction.change(changeAddress);
  
      // //manually set transaction fees: 20 satoshis per byte
      transaction.fee(Math.round(fee));
  
      // // Sign transaction with your private key
      transaction.sign(privateKey);
  
      // // serialize Transactions
      const serializedTransaction = transaction.serialize();
      console.log(serializedTransaction, "serialTransaction");
  
      const broadCastedResult = await broadcastTransaction(serializedTransaction);
      console.log(broadCastedResult, "broadCastedResult");
      return broadCastedResult;
  
      // const result = await axios({
      //   method: "POST",
      //   url: `https://blockstream.info/testnet/api/tx`,
      //   data: serializedTransaction,
      // });
      // console.log(result.data, "data of the internet ");
      // return result.data;
    } catch (error) {
       
    }};


  
const depositRequest = async (amount: number, destinationAddress: string)=> {
  // "0xde358FCcA54Fa226aE16Ac3927487260dAfc3835"
  
    try {
      const quoteRequest = {
        srcChain: Chains.Bitcoin,
        destChain: Chains.Arbitrum,
        srcAsset: Assets.BTC,
        destAsset: Assets.USDC,
        amount: (amount * 1e8).toString(),
        destAddress: destinationAddress,
        maxBoostFeeBps: 30,
      };
  
      const swapQuote = await swapSDK.getQuote(quoteRequest);
      console.log(swapQuote, "swapQuote");
      const exchangeInfo = calculateExchangeRate(swapQuote);
      console.log(`You will receive ${exchangeInfo.usdcReceived} USD`);
      return{
        swapQuote:swapQuote, 
        exchangeInfo
      }
      // Requesting a deposit address
    
      // return {
      //   depositAddress: requestAddress.depositAddress,
      //   depositAmount: requestAddress.amount
      // };
    // const quoteRequest = {
    //   srcChain: Chains.Bitcoin,
    //   destChain: Chains.Arbitrum,
    //   srcAsset: Assets.BTC,
    //   destAsset: Assets.USDC,
    //   amount: (amount * 1e8).toString(),
    //   destAddress: destinationAddress,
    //   maxBoostFeeBps: 30,
    // };

    // const swapQuote = await swapSDK.getQuote(quoteRequest);
    // console.log(swapQuote, "swapQuote");
    // const exchangeInfo = calculateExchangeRate(swapQuote);
    // console.log(`You will receive ${exchangeInfo.usdcReceived} USD`);

    // // Requesting a deposit address
    // const requestAddress = await swapSDK.requestDepositAddress(quoteRequest);
    // console.log("Deposit Address:", requestAddress);
    // console.log("Deposit Channel ID:", requestAddress.depositChannelId);

    // return {
    //   depositAddress:requestAddress.depositAddress, 
    //   depositAmount:requestAddress.amount
    // }

    // I
  } catch (error) {
    menu.end("Failed to swap to USDC")
  }
}

const getStatus = async(id:string) => {
  console.log(
    await swapSDK.getStatus({
      // id: "1904116-Bitcoin-259",
      id
    }),
  );
}


export{createNewSavingsPool, convertPinToHex, contributeToPool, voteOnRecipient, performTokenSwap, sendBitcoin, getStatus, depositRequest , registerUserToRegistry}