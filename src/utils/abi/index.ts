import axios from "axios"
import {  ethers, BigNumber } from "ethers"

const getAbi = async(address:string)=>{
    const etherscanPrivatekey = "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW"
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${etherscanPrivatekey}`
    const res = await axios.get(url)
    const data = JSON.parse(res.data.result)
    return data;

}
export const provider = new ethers.providers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/FUXZuAczhOuov14_rRnuvpoy2JpiOBiK")

const contractInstanceCreator= (abi:any, provider: ethers.providers.Provider,address:string)=>{
    const contractInstance = new ethers.Contract(address, abi, provider);
    return contractInstance;
}
