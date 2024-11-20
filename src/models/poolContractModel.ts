// poolContractModel.js
import mongoose, { Document, Model, Schema, Query } from "mongoose";


export interface IPoolContract extends Document {
 address: string;
 tokenA: { type: typeof Schema.Types.ObjectId; ref: string; };
  tokenB: { type: typeof Schema.Types.ObjectId; ref: string; };
}

const poolContractSchema = new mongoose.Schema<IPoolContract, Model<IPoolContract>
>({
  address: {
    type: String,
    required: true,
    unique: true // Ensures unique addresses for each pool contract
  },
  tokenA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token' // Reference to the TokenModel
  },
  tokenB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token' // Reference to the TokenModel
  },
  // Add other fields as needed
});

export const PoolContractModel = mongoose.model('PoolContract', poolContractSchema);

module.exports = PoolContractModel;
// 0x000000000000000000000000000