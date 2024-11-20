


import { Token } from "@uniswap/sdk-core";
export interface UniswapConfig {

    rpc: {
      local?: string
      mainnet?: string
    }
    wallet: {
      address: string
      privateKey?: string
    }
    tokens: {
      in?: Token
      amountIn?: number
      out?: Token
      poolFee?: number
    }
  }




// SessionManager 
  export type Session = {
    [key: string]: any;
  };
  
  export type Sessions = {
    [sessionId: string]: Session;
  };
  
export type RegisterUserPassportKeyReturn ={

    jsonrpc: string,
    result: {
      account_id: string,
      identifier_hash:string,
    },
    id: number

} 





export type UserInput = {
    username: string;
    password: string;
}

export interface ApiError {
    success: boolean;
    message: string;
    error?: string;
    data?: Record<string, unknown>;
}

interface IMerchantWallet {
    walletId: string;
    currency: "GHS" | "KES";
    balance: number;
    collectionBalance: number;
    merchantId: string;
  }
  
  interface IApiResponse<T> {
    data: T;
  }
  
  interface ILoginResponse {
    loginLink: string;
  }
  
  interface IAccessTokenResponse {
    accessToken: string;
  }
  
  interface IKeysResponse {
    public_key: string;
    secret_key: string;
  }






/* ------------------------------| 
     TYPES FOR THE ONRAMP API  ------|
   ------------------------------|
*/


  export interface Customer {
    phoneNumber: string;
    accountName: string;
    network: string;
}

export interface CreateOnRampQuoteRequest {
  customer: {
      phoneNumber: string;
      accountName: string;
      network: string;
  };
  fiatAmount: number;
  fiatCurrency: string;
  chain: string;
  token: string;
  receiverAddress: string;
}


export interface CreateQuoteOnRampResponse {
    success: boolean;
    message: string;
    data: {
      rate: {
        from: string;
        to: string;
        value: number;
      };
      customerId: string;
      chain: string;
      token: string;
      receiverAddress: string;
      fiatAmount: number;
      fiatCurrency: string;
      cryptoAmount: number;
      quoteId: string;
    }
}



export interface SubmitQuoteOnRampRequest{
    quoteId:string;
}




export interface SubmitQuoteOnRampResponse{
    success: boolean;
    message: string;
    data:{
      transactionId:string;
      customerId:string;
      status: string;
  }
}




export interface GetOnRampTxnRequest{
    transactionId:string;
}


export interface OnRampTxnData {
    transactionId:string;
    quoteId:string;
    transactionStatus:string;
    cryptoStatus:string;
    transactionHash:string;
}


export interface GetOnRampTxnResponse{
    success: boolean;
    message: string;
    data:OnRampTxnData

}

export interface TransactionStatusResponse {
    success: boolean;
    message: string;
    data: {
        transactionId: string;
        quoteId: string;
        transactionStatus: string;
        cryptoStatus: string;
        transactionHash: string;
    };
}

export interface TransactionRateResponse {
    success: boolean;
    message: string;
    data: {
        from: string;
        to: string;
        value: number | null;
    };
}




/* ------------------------------| 
     TYPES FOR THE COLLECTIONS AND PAYOUTS API  ------|
   ------------------------------|
*/






export interface Receiver {
    phoneNumber: string;
    accountName: string;
    network: string;
  }
  
  export interface CreatePayoutRequest {
    receiver: Receiver;
    amount: number;
    walletId: string;
    currency: string;
    callbackUrl: string;
  }
  
  export interface CreatePayoutResponse {
    success: boolean;
    message: string;
    data: {
      transactionId: string;
      customerId: string;
      walletId: string;
      status: string;
    };
  }
  
  export interface GetPayoutStatusResponse {
    success: boolean;
    message: string;
    data: {
      transactionId: string;
      status: string;
      amount: number;
      fee: number;
      transactionAmount: number;
      wallet: string;
      customer: string;
    };
  }
  
  export interface GetWalletsResponse {
    success: boolean;
    message: string;
    data: Wallet[];
  }
  
  export interface Wallet {
    walletId: string;
    currency: string;
    balance: number;
    collectionBalance: number;
    merchantId: string;
  }
  
  export interface CreateCollectionRequest {
    customer: Receiver;
    amount: number;
    currency: string;
    callbackUrl: string;
  }
  
  export interface CreateCollectionResponse {
    success: boolean;
    message: string;
    data: {
      transactionId: string;
      customerId: string;
      walletId: string;
      status: string;
    };
  }
  
  export interface GetCollectionStatusResponse {
    success: boolean;
    message: string;
    data: {
      transactionId: string;
      status: string;
      amount: number;
      fee: number;
      transactionAmount: number;
      wallet: string;
      customer: string;
    };
  }







/* ------------------------------| 
     TYPES FOR THE OFFRAMP API  ------|
   ------------------------------|
*/


export interface CreateQuoteOffRampRequest {
    receiver: Receiver;
    cryptoAmount: number;
    fiatCurrency: string;
    chain: string;
    token: string;
  }

  export interface OfframpQuoteDataResponse {
    cryptoAmount: number;
    fiatCurrency: string;
    chain: string;
    token: string;
    rate: {
      from: string;
      to: string;
      value: number;
    };
    customerId: string;
    fiatAmount: number;
    quoteId: string;
    address: string;

  }
  
  export interface CreateQuoteOffRampResponse {
    success: boolean;
    message: string;
    data: {
      cryptoAmount: number;
      fiatCurrency: string;
      chain: string;
      token: string;
      rate: {
        from: string;
        to: string;
        value: number;
      };
      customerId: string;
      fiatAmount: number;
      quoteId: string;
      address: string;
    }
  }
  
  export interface SubmitQuoteOffRampRequest {
    quoteId: string;
    transactionHash: string;
  }
  
  export interface SubmitQuoteOffRampResponse {
    success: boolean;
    message: string;
    data: {
      transactionId: string;
      customerId: string;
      status: string;
    };
  }
  
  export interface TransactionStatusOffRampResponse {
    success: boolean;
    message: string;
    data: {
      transactionId: string;
      quoteId: string;
      transactionStatus: string;
    };
  }
  
  export interface TransactionRateOffRampResponse {
    success: boolean;
    message: string;
    data: {
      from: string;
      to: string;
      value: number;
    };
  }


  

export {
    IAccessTokenResponse, 
    IApiResponse, 
    IKeysResponse, 
    ILoginResponse, 
    IMerchantWallet, 
   
}



