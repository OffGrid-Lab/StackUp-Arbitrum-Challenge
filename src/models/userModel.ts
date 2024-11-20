import mongoose, { Document, Model, Schema, Query } from "mongoose";
import eoaAccount from "./eoaAccount.js";

import { accountSchema ,IEOAAccount} from "./eoaAccount.js";
// User Config
import { IUser } from "./types.js";

const UserSchema = new Schema<IUser>({
  phoneNumber: { type: String, required: true, unique: true },
  passport_account_id: { type: String, required: true },
  passport_identifier_hash: { type: String, required: true },
  smartContractWallet: { type: String },
  authentications: {
    pinCode: { type: String, required: true, select: false },
    salt: { type: String },
    sessionToken: String,
  },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

// UserSchema.pre("save", function (next) {
//   if (!this.isModified("pinCode")) return next();
//  const hashedPassword = authentication(this.phoneNumber,this.authentication.pinCode)

// });

// UserSchema.methods.correctPin  = async()=>{

// }

// User Actions
export const getUsers = () => UserModel.find();
export const getUserByPhoneNumber = (phoneNumber: string) =>
  UserModel.findOne({ phoneNumber });
// export const getUserBySessionToken = (sessionToken: string) =>
//   UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = async (values: Record<string, any>) => {
 
  try {
    const newUser = await UserModel.create(values);
    return newUser;
  } catch (error) {
    return error;
  }
};

export const createEoA = async (values: Record<string, any>) => {
  try {
    const newUser = await eoaAccount.create(values);
    return newUser;
  } catch (error) {
    return error;
  }
};

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
