import mongoose from "mongoose";

export const tokenSchema = new mongoose.Schema({
  name: String,
  address: String,
  symbol: String,
  supply:String
});

export const TokenModel = mongoose.model("Token", tokenSchema);


