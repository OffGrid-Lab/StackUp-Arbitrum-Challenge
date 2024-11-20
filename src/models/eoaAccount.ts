import mongoose, { Document, Model, Schema, Query } from "mongoose";

export interface IEOAAccount extends Document {
  privateKey: string;
  address: string;
  mnemonic: string;
}
export const accountSchema = new mongoose.Schema<
  IEOAAccount,
  Model<IEOAAccount>
>({
  privateKey: {
    type: String,
    required: [true, "private key is required"],
  },

  address: {
    type: String,
    required: [true, "Signer address is required "],
  },

  mnemonic: {
    type: String,
    required: [true, "Please send Mnemonic"],
  },
});

const eoaAccount = mongoose.model("eoaAccount", accountSchema);

export default eoaAccount;
