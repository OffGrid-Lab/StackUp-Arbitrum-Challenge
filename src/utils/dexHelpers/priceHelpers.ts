// import axios from "axios"
// import {  ethers, BigNumber, Contract } from "ethers"

// import bn from "bignumber.js"

// const getPoolImmutable = async(poolContract:any)=>{
//     const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        
//         poolContract.tickSpacing(),
//         poolContract.fee(),
//         poolContract.liquidity(),
//         poolContract.slot0(),
//       ])
    
//       return {
//         tickSpacing: tickSpacing,
//         fee,
//         liquidity: liquidity.toString(),
//         sqrtPriceX96: slot0[0],
//         tick: slot0[1],
//       }


// }


// async function getPoolState(poolContract: Contract) {
//     const slot = await poolContract.slot0()
  
//     const state = {
//       sqrtPriceX96: slot[0]
//     }
  
//     return state
//   }

// const v2_SWAP_ROUTER = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E'

// function encodePriceSqrt(reserve1: string, reserve0: string): string {
//     const sqrtValue = new bn(reserve1)
//                         .div(reserve0)
//                         .sqrt()
//                         .times(new bn(2).pow(96))
//                         .toString();
//     return BigNumber.from(sqrtValue).toString();
// }

// const getAbi = async(address:string)=>{
//     const etherscanPrivatekey = "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW"
//       const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${etherscanPrivatekey}`
//       const res = await axios.get(url)
//    const data = JSON.parse(res.data.result)
//    return data;

//     }

//     const provider = new ethers.providers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF")

//     const contractInstanceCreator= (abi:any, provider: ethers.providers.Provider,address:string)=>{
//         const contractInstance = new ethers.Contract(address, abi, provider);
//         return contractInstance;
//     }

// export {
//     getPoolImmutable,
//     getAbi,
//     provider,
//     contractInstanceCreator,
//     v2_SWAP_ROUTER
// }
