import axios from 'axios';
import { Redis } from 'ioredis';
import * as dotenv from "dotenv";
import {dummyTokens} from "./dummyTokens.js"
import qs from 'qs'
 

dotenv.config();

// const REDIS_KEY = process.env.REDIS_KEY!
// console.log(REDIS_KEY, "REDDIS KEY")


// export const redisClientInstance = new Redis(`rediss://default:${REDIS_KEY}cosmic-wallaby-52438.upstash.io:6379`);

import { createPublicClient, http } from 'viem'
import { arbitrumSepolia, mainnet } from 'viem/chains'
import { ERC20_ABI } from '../abi/ERC20Factory.js';
export const rampHeaders = {

};




export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        try{
            return await fn(args)
        }catch(error){
           return Promise.resolve(()=>  {error:"error with handler"}) as ReturnType<T>
 
        }


    }
}


export const getProvider = async()=>{

 
const client = createPublicClient({ 
  chain: arbitrumSepolia, 
  transport: http('https://arb-sepolia.g.alchemy.com/v2/FUXZuAczhOuov14_rRnuvpoy2JpiOBiK') 
}) 
return client
}
export type ProviderType = Awaited<ReturnType<typeof getProvider>>;



export const getTokenBalance = async (walletAddress: string, tokenAddress: string = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d") => {
    const client = createPublicClient({
      chain: arbitrumSepolia,
      transport: http('https://arb-sepolia.g.alchemy.com/v2/FUXZuAczhOuov14_rRnuvpoy2JpiOBiK')
    });
  

    const address = walletAddress as `0x${string}`
  
  const data = await client.readContract({
    abi:ERC20_ABI,
    functionName: 'balanceOf',
    address: tokenAddress as `0x${string}`,
    args: [address]
  });

  
    // const balance = await contract.methods.balanceOf(walletAddress).call(); const balance = await contract.methods.balanceOf(walletAddress).call();
    return data;
  };


const ALL_TOKENS_API = 'https://tokens.coingecko.com/uniswap/all.json';




export type TokenType = typeof dummyTokens
  
const CACHE_KEY = 'uniswap_tokens';
const CACHE_EXPIRATION = 10 * 24 * 60 * 60; // 10 days in seconds

export const fetchTokenAddresses = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment detected, returning dummy tokens');
  
    return dummyTokens;
  }

  // Check the cache
  // const cachedTokens = await redisClientInstance.get(CACHE_KEY);
  // if (cachedTokens) {
  //   console.log('Fetching data from cache');
  //   return JSON.parse(cachedTokens) as TokenType
  // }

  try {
    let response = await fetch(ALL_TOKENS_API);
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    const tokens = tokenListJSON.tokens as TokenType

    // Cache the tokens
    // await redisClientInstance.set(CACHE_KEY, JSON.stringify(tokens), 'EX', CACHE_EXPIRATION);

    return tokens;
  } catch (error) {
    console.error('Error fetching token addresses:', error);
    return [];
  }
};
interface SwapQuoteParams {
  fromToken: string;
  toToken: string;
  amountoffromToken: Number;
  userAddress: string;
}


export const createSwapQuote = async ({fromToken , toToken, amountoffromToken, userAddress}:SwapQuoteParams)=>{
  try{
    const params = {
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amountoffromToken,
      takerAddress: userAddress,
    }
    
      const headers = {
        '0x-api-key': process.env.ZEROX_API_KEY || '[api-key]' // Use environment variable for API key
      };
    
    
        const response = await axios.get(
          `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
          { headers }
        );
        
        const swapQuoteJSON = response.data;
        console.log("Quote: ", swapQuoteJSON);
    
    
        return swapQuoteJSON;
      } catch (error) {
        console.error("Error fetching swap quote:", error);
        throw error;
      }
} 

