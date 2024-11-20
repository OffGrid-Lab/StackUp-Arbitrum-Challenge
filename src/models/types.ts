export interface IUser extends Document {
    phoneNumber: string;
    smartContractWallet: string;
    passport_account_id: string;
    passport_identifier_hash: string;
    authentications: {
      pinCode: string;
      salt: string;
      sessionToken: string;
    };
  }
  
  export interface Sessions {
    [sessionId: string]: {
      phoneNumber?: string;
      smartAccountClient?: any;
      recipient?: string;
    };
  }