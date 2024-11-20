import bcrypt from "bcrypt";
import crypto from 'crypto';
import  bn from'bignumber.js'
import * as dotenv from "dotenv";
import {  getUserByPhoneNumber } from "../../dbServices/userService.js";
import { createPassportSigner } from "../passport/passport.js";
import { SmartAccountSigner, arbitrumSepolia } from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";



dotenv.config();

const saltRounds = 10;
const SECRET = process.env.PASSWORD_SECRET_AUTH!;


export const hashPassword = (password:string) => {
	const salt = bcrypt.genSaltSync(saltRounds);
	return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain:string, hashed:string) =>
	bcrypt.compareSync(plain, hashed);


export const authentication = (salt: string, password: string): string => {
	return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
  
  }
  
export const random = () => crypto.randomBytes(128).toString('base64');



  export const confirmLogin = async (phoneNumber:string, pin :string) => {
  try {



    const user = await getUserByPhoneNumber(phoneNumber).select(
      "+authentications.salt +authentications.pinCode"
    );

    if (!user) {
      return "NONEXISTENT";
    }
    // 0x6556f8bdd69d79daff40cb933ca64ced792f3e722443c3565f676e64cfbd0818
    // 0x6556f8bdd69d79daff40cb933ca64ced792f3e722443c3565f676e64cfbd0818
    const expectedHash = authentication(user.authentications.salt , pin);
    const hashFromDB = user && user.authentications && user.authentications.pinCode
    console.log(hashFromDB, "in databse hash")
    console.log(expectedHash, "expected hash")
    if (hashFromDB != expectedHash) {
      return "UNAUTHORIZED";
    }

    const salt = random();
    user.authentications.sessionToken = authentication(
      salt + phoneNumber,
      user._id.toString()
    );

    await user.save();

    // res.cookie("ANTONIO-AUTH", user.authentication.sessionToken, {
    //   domain: "localhost",
    //   path: "/",
    // });

    return "AUTHORIZED"
  } catch (error) {
    console.log(error);
    return JSON.stringify(error)
  }
};



export const createNewSmartWallet = async(phoneNumber:string, pinCode:string)=>  {


 
    try {

        // const passportSigner = await createPassportSigner({
        //   username:phoneNumber
        // })
   
// const signer = passportSigner as SmartAccountSigner
// 0x6Dea11F729849AA59773BFCF42eE8336B301be1d

// const smartAccountClient = await createModularAccountAlchemyClient({
// apiKey: "FUXZuAczhOuov14_rRnuvpoy2JpiOBiK",
// chain: arbitrumSepolia,
// signer: signer,
// gasManagerConfig: {
//   policyId: "587f2a27-b5e0-4cff-a44e-8bf85a343dfe",
// },
// })



// const smartContractWallet =  smartAccountClient.getAddress
// const salt = random()+ phoneNumber
// const userData = {
//     phoneNumber :phoneNumber,
// 	smartContractWallet,
// 	authentication:{
		// pinCode:authentication(salt, phoneNumber),
// 		pinCodeConfirm:"", 
// 		salt
		
// 	}

// }

// console.log(smartContractWallet, 'wallet') 
//  await createUser(userData);

return {
	// address:smartContractWallet
	address:""
}
        // create a UO here
    
        // // Send a sponsored UO from your smart account like this:
      //   const { hash } = await smartAccountClient.sendUserOperation({
      //     uo: {
      //       target: "0x0000000000000000000000000000000000000000",
      //       data: "0x",
      //       value: BigInt(0),
      //     },
      //   })
    
      //   return res.send({ address, hash })
      } catch (error) {
        console.log(error)
      //   return next(error)
      }




}