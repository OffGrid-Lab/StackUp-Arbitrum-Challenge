declare module 'bitcore-mnemonic' {

    class Mnemonic {
      constructor(data?: string | string[]);
      toString(): string;
      toHDPrivateKey(passphrase?: string, network?: any): HDPrivateKey;
      static isValid(mnemonic: string): boolean;
      static fromString(mnemonic: string): Mnemonic;
      static fromRandomBytes(bytes: Buffer): Mnemonic;
      
      static Words: {
        ENGLISH: string[];
        SPANISH: string[];
        JAPANESE: string[];
        CHINESE: string[];
        FRENCH: string[];
        ITALIAN: string[];
        KOREAN: string[];
      };
    }
  
    export = Mnemonic;
  }