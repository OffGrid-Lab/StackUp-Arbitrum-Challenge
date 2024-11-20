import { NextFunction, Request, Response } from "express";
// import { createPassportSignerpassport,  } from "../utils/passport/passport";
import { SmartAccountSigner, arbitrumSepolia } from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { createPassportSigner } from "@/utils/passport/passport.js";
import { passport } from "@/utils/passport/passport.js";
import { KeySigner } from "@0xpass/key-signer";
import { Network, Passport } from "@0xpass/passport";


 export const setupAdminKey = async (request:Request, response:Response, next:NextFunction)=>{


  console.log(request.body, "request")
     try{
     

      
    
const userInput = {
   username: "justicessiel@gmail.com",
  password: "10719069",
 };

 await passport.setupEncryption();

  // it creates end to end encryption channel btn pass0x channel and my channel

const response = await passport.delegatedRegisterAccount(userInput);
 console.log(response); // it creates a delegated account for the user

passport.setUserData(userInput);

   

         }catch(error){
next(error)
         }
    }

 export const createSmartWallet =async (request:Request ,response:Response, next:NextFunction)=>{
    
     try {
         const mockUsername = "mock@gmail.com"
         const passportSigner = await createPassportSigner({
           username: "+233244389485",
         })
        //  0x842723Fe3Ac2E2798885CA12606a7FC09109a675
   
 const signer = passportSigner as SmartAccountSigner
 // 0x6Dea11F729849AA59773BFCF42eE8336B301be1d
 console.log("SIGNER", signer.getAddress())
 const signerAddress =await signer.getAddress()

 const smartAccountClient = await createModularAccountAlchemyClient({
 apiKey: "FUXZuAczhOuov14_rRnuvpoy2JpiOBiK",
 chain: arbitrumSepolia,
 signer: signer,
 gasManagerConfig: {
   policyId: "587f2a27-b5e0-4cff-a44e-8bf85a343dfe",
 },
 })

// console.log()


const address =  await smartAccountClient.getAddress()
        // create a UO here
    
         // // Send a sponsored UO from your smart account like this:
       //   const { hash } = await smartAccountClient.sendUserOperation({
       //     uo: {
       //       target: "0x0000000000000000000000000000000000000000",
       //       data: "0x",
       //       value: BigInt(0),
       //     },
       //   })
    
         return response.json({address,signerAddress })
       } catch (error) {
         console.log(error)
       //   return next(error)
       }
 }

            
        