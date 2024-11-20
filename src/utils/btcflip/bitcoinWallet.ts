// sending bitcoin
import axios from "axios"
import { QuoteResponse} from "@chainflip/sdk/swap"
import BitCore from "bitcore-lib";
import Mnemonic from "bitcore-mnemonic";
import WebSocket from "ws";




const createWallet = (network = BitCore.Networks.mainnet) => {

  const privateKey = new BitCore.PrivateKey();
  const address = privateKey.toAddress();
  return {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };
};

const getbalance = async (addressPublicKey:string) => {
  let totalAmountAvailable = 0;

  const response = await axios.get(
    `https://api.blockcypher.com/v1/btc/test3/addrs/${addressPublicKey}?includeScript=true&unspentOnly=true`,
  );

  console.log(response.data.final_balance, "final _ balance");
  console.log(response.data.unconfirmed_balance, "unconfirmed _ balance");
  return parseInt(response.data.final_balance)
  // for (const element of response.data.txrefs) {
  //   totalAmountAvailable += element.value;
  // }

  // console.log(totalAmountAvailable, "total");
};

/**
A Hierarchical Deterministic (HD) wallet is the term used to describe a wallet which uses a seed to derive public and private keys
**/

const createHDWallet = (network = BitCore.Networks.mainnet) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.SPANISH);
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  return {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
  };
};

const derivePrivateKey = (mnemonic:string, path:string, network =BitCore.Networks.mainnet) => {
  const passPhrase = new Mnemonic(mnemonic);
  const hdPrivateKey = passPhrase.toHDPrivateKey(
    passPhrase.toString(),
    network,
  );
  const derivedKey = hdPrivateKey.derive(path);
  return {
    privateKey: derivedKey.privateKey.toString(),
    address: derivedKey.publicKey.toAddress().toString(),
  };
};


function setupWebSocketListener(address: string) {
    const websocket = new WebSocket("wss://ws.blockchain.info/inv");
  
    websocket.on("error", console.error);
  
    websocket.on("open", function open() {
      console.log("WebSocket connection opened");
      websocket.send('{"op":"unconfirmed_sub"}');
    });
  
    websocket.onmessage = function (event) {
      const msgData = JSON.parse(event.data.toString());
      if (msgData.op === "utx") {
        // console.log("New confirmed transaction detected", msgData.x.hash);
        if (msgData.x.hash == address) {
          console.log("Transaction confirmed");
          websocket.close();
        }
        // for (const output of msgData.x.hash) {
        //   if (output.addr === address) {
        //     console.log(`Transaction detected to deposit address: ${address}`);
        //     console.log(`Amount received: ${output.value / 1e8} BTC`);
  
        //     // Here you can add code to handle the successful deposit
        //     handleSuccessfulDeposit(output.value);
  
        //     // Optionally, close the WebSocket connection if you're done listening
        //     // websocket.close();
        //   }
        // }
      }
    };
  }


const broadcastTransaction = async (rawTransaction: string) => {
    try {
      const response = await axios.post(
        "https://api.blockcypher.com/v1/btc/test3/txs/push",
        {
          tx: rawTransaction,
        },
      );
  
      return response.data;
    } catch (error) {
      console.error("Error broadcasting transaction:", error);
     
    }
  };




function calculateExchangeRate(quoteResponse: QuoteResponse) {
    const srcAmount = BigInt(quoteResponse.amount);
    const destAmount = BigInt(quoteResponse.quote.egressAmount);
  
    let btcAmount, usdcAmount;
  
    if (quoteResponse.srcAsset === "BTC") {
      btcAmount = Number(srcAmount) / 1e8; // Convert satoshis to BTC
      usdcAmount = Number(destAmount) / 1e6; // Convert smallest unit to USDC
    } else {
      usdcAmount = Number(srcAmount) / 1e6; // Convert smallest unit to USDC
      btcAmount = Number(destAmount) / 1e8; // Convert satoshis to BTC
    }
  
    const btcToUsdcRate = usdcAmount / btcAmount;
    const usdcToBtcRate = btcAmount / usdcAmount;
    return {
      btcReceived: btcAmount.toFixed(8),
      usdcReceived: usdcAmount.toFixed(6),
      usdcPerBtc: usdcToBtcRate.toFixed(8),
      btcPerUsdc: btcToUsdcRate.toFixed(2),
    };
}
  

export {
    calculateExchangeRate,
     broadcastTransaction,
    createHDWallet,
    createWallet,
    derivePrivateKey,
    getbalance,
}

