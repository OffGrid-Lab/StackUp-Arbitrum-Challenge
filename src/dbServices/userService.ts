import { IUser } from "@/models/types.js";
import {  UserModel } from "../models/userModel.js";

export const getUsers = () => UserModel.find();
export const getUserByPhoneNumber = (phoneNumber: string) =>
  UserModel.findOne({ phoneNumber });

export const getUserById = (id: string) => UserModel.findById(id);

export const saveUserInDBWithSmartWallet = async (values: Record<string, any>): Promise<IUser | { error: string }> => {
  try {
    const newUser = await UserModel.create(values);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "creating user error" };
  }
};
export const checkifUserExist = async (phoneNumber: string) => {
  if (phoneNumber) {
    try {
      const isExist = await getUserByPhoneNumber(phoneNumber).lean();
      return isExist !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  return false;
};
