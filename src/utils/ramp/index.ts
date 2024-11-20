import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
    ApiError,

    CreateCollectionRequest,
    CreateCollectionResponse,
    CreateOnRampQuoteRequest,
    CreatePayoutRequest,
    CreatePayoutResponse,
    CreateQuoteOffRampRequest,
    CreateQuoteOffRampResponse,
    CreateQuoteOnRampResponse,
    OfframpQuoteDataResponse,
   
    GetCollectionStatusResponse,
    GetPayoutStatusResponse,
    GetWalletsResponse,
    IAccessTokenResponse,
    IApiResponse,
    IKeysResponse,
    ILoginResponse,
    IMerchantWallet,

    SubmitQuoteOnRampResponse,

  

    TransactionRateResponse,
    TransactionStatusResponse,
    SubmitQuoteOffRampRequest,
    SubmitQuoteOffRampResponse,
    SubmitQuoteOnRampRequest
         } from "../types.js";
import { asyncHandler, rampHeaders } from '../constant/index.js';

let cachedAccessToken: string | null = null;
let cachedPublicKey: string | null = null;
let cachedSecretKey: string | null = null;
let tokenExpiry: number | null = null;

const createHeaders = (accessToken?: string, publickey?: string, secretkey?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (publickey) {
    headers['X-API-KEY'] = publickey;
  }

  if (secretkey) {
    headers['X-API-SECRET'] = secretkey;
  }

  return headers;
};


// Define a type for HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Enhance function to be more type-safe
const axiosApi = async <T = unknown, U = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    headers: Record<string, string>,
    url: string,
    data?: T
): Promise<AxiosResponse<U> | ApiError> => {
    try {
        const response = await axios({
            method: method,
            headers: headers,
            url: url,
            data: data || {}, // Use data if provided, otherwise an empty object
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response) {
                return axiosError.response.data;
            } else {
                return {
                    success: false,
                    message: 'Network Error',
                    error: axiosError.message,
                };
            }
        } else {
            return {
                success: false,
                message: 'An unknown error occurred',
                error: (error as Error).message,
            };
        }
    }
};




export const createOnRampQuote = async (body:CreateOnRampQuoteRequest) => {
  
  try {
    const response = await axios.post(
      'https://sandbox.pennyramp.com/api/v1/onramp/quote',
      {...body },
      {
        headers: {
         
        }
      }
    ) 
   const data = response.data as CreateQuoteOnRampResponse
    return data
  } catch (error) {
    console.error(error);
  }
};




// export const createOnRampQuote = asyncHandler((requestData: CreateOnRampQuoteRequest)=> {

//      return axiosApi<CreateOnRampQuoteRequest, CreateQuoteOnRampResponse>(
//     'POST',
//     rampHeaders,
//     'https://sandbox.pennyramp.com/api/v1/onramp/quote',
//     {...requestData},
//   );
// });

export const submitOnRampQuote = async (body:SubmitQuoteOnRampRequest)=>{
  try{
     console.log(body, "body of the submit quote")
    const response = await axios.post(
      'https://sandbox.pennyramp.com/api/v1/onramp/submit/quote',
        {quoteId:body},
      {
        headers: {
      
        }
      }
    );
    console.log(response, "submit quote response")
   const data = response.data as SubmitQuoteOnRampResponse
    return data
  } catch (error) {
    console.error("");
  }

} 
  
// export const submitOnRampQuote = asyncHandler( (requestData:SubmitQuoteOnRampRequest) => {
//     return  axiosApi<SubmitQuoteOnRampRequest, SubmitQuoteOnRampResponse>(
//         'POST',
//         rampHeaders,
//         'https://sandbox.pennyramp.com/api/v1/onramp/submit/quote',
//         requestData
//     );
// });



export const getTransactionOnRampStatus = asyncHandler(async (transactionId: string) => {
  return await axiosApi<null, TransactionStatusResponse>(
    'GET',
    rampHeaders,
    `https://sandbox.pennyramp.com/api/v1/onramp/status/${transactionId}`
  );
});

export const getTransactionRateOnRamp = asyncHandler(async (from: string, to: string) => {
  return await axiosApi<null, TransactionRateResponse>(
    'GET',
    rampHeaders,
    `https://sandbox.pennyramp.com/api/v1/onramp/rate/${from}/${to}`
  );
});

export const createPayout = asyncHandler(async (requestData: CreatePayoutRequest) => {
  return await axiosApi<CreatePayoutRequest, CreatePayoutResponse>(
    'POST',
    rampHeaders,
    'https://sandbox.pennyramp.com/api/v1/payouts/mobile-money',
    requestData
  );
});

export const getPayoutStatus = asyncHandler(async (transactionId: string) => {
  return await axiosApi<null, GetPayoutStatusResponse>(
    'GET',
    rampHeaders,
    `https://sandbox.pennyramp.com/api/v1/payouts/mobile-money/status/${transactionId}`
  );
});

export const getWallets = asyncHandler(async () => {
  return await axiosApi<null, GetWalletsResponse>(
    'GET',
    rampHeaders,
    'https://sandbox.pennyramp.com/api/v1/wallets'
  );
});

export const createCollection = asyncHandler(async (requestData: CreateCollectionRequest) => {
  return await axiosApi<CreateCollectionRequest, CreateCollectionResponse>(
    'POST',
    rampHeaders,
    'https://sandbox.pennyramp.com/api/v1/collections/mobile-money',
    requestData
  );
});

export const getCollectionStatus = asyncHandler(async (transactionId: string) => {
  return await axiosApi<null, GetCollectionStatusResponse>(
    'GET',
    rampHeaders,
    `https://sandbox.pennyramp.com/api/v1/collections/mobile-money/status/${transactionId}`
  );
});

export const createOffRampQuote = asyncHandler(async (requestData: CreateQuoteOffRampRequest) => {
  return await axiosApi<CreateQuoteOffRampRequest, CreateQuoteOffRampResponse>(
    'POST',
    rampHeaders,
    'https://sandbox.pennyramp.com/api/v1/offramp/quote',
    requestData
  );
});

export const submitOffRampQuote = asyncHandler(async (requestData: SubmitQuoteOffRampRequest) => {
  return await axiosApi<SubmitQuoteOffRampRequest, SubmitQuoteOffRampResponse>(
    'POST',
    rampHeaders,
    'https://sandbox.pennyramp.com/api/v1/offramp/submit/quote',
    requestData
  );
});

export const getTransactionOffRampStatus = asyncHandler(async (transactionId: string) => {
  return await axiosApi<null, TransactionStatusResponse>(
    'GET',
    rampHeaders,
    `https://sandbox.pennyramp.com/api/v1/offramp/status/${transactionId}`
  );
});

export const getTransactionRateOffRamp = asyncHandler(async (from: string, to: string) => {
  return await axiosApi<null, TransactionRateResponse>(
    'GET',
    rampHeaders,
    `https://sandbox.pennyramp.com/api/v1/offramp/rate/${from}/${to}`
  );
});
