import { PassportSigner } from "@0xpass/alchemy-signer"
import { Network, Passport } from "@0xpass/passport"
// import { mainnet, arbitrumSepolia } from "viem/chains"
import { SmartAccountSigner, arbitrumSepolia } from "@alchemy/aa-core"
import { KeySigner } from "@0xpass/key-signer"
import dotenv from "dotenv"
dotenv.config()
import path from 'path'
import { UserInput } from "@/utils/types.js"

import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy"
import { UserModel } from "@/models/userModel.js"
import { ethers } from "ethers"

const SCOPE_ID = process.env.SCOPE_ID!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY!;

console.log("SCOPE ID ", SCOPE_ID);


// https://arb-sepolia.g.alchemy.com/v2/FUXZuAczhOuov14_rRnuvpoy2JpiOBiK

// export const passport = new Passport({
//   network: Network.TESTNET,
//   scopeId: SCOPE_ID,
//   signer: keySigner,
// })

const signer = new KeySigner('./shika_wallet_priv.der', false);

console.log(signer)
//  "cbec5f34-6c0e-4151-83e2-eb1b65ad7a47"
export const passport = new Passport({
  network: Network.TESTNET,
  scopeId:SCOPE_ID,
  signer: signer,
})

export const createPassportSigner = async ({
  username = "+233555418920"
}: {

  username: string
}) => {



  const passportSigner = new PassportSigner({
    inner: passport,
    enableSession: false,
  })

  await passportSigner.authenticate({
    username: username,
    chain: arbitrumSepolia,
    fallbackProvider: "https://arb-sepolia.g.alchemy.com/v2/FUXZuAczhOuov14_rRnuvpoy2JpiOBiK",
  })

  return passportSigner
}

export const registerUser = async ({ username }: { username: string }) => {

  await passport.setupEncryption()
  const res = await passport.delegatedRegisterAccount({ username })
  return res


}

export const getAccountClientForSmartWallet = async (signerInput: PassportSigner) => {
  const signer = signerInput as SmartAccountSigner;


  const smartAccountClient = await createModularAccountAlchemyClient({
    apiKey: "FUXZuAczhOuov14_rRnuvpoy2JpiOBiK",
    chain: arbitrumSepolia,
    signer: signer,
    gasManagerConfig: {
      policyId: "587f2a27-b5e0-4cff-a44e-8bf85a343dfe",
    },
  });
  return smartAccountClient
}


export async function loginUser(username: string, password: string) {
  const user = await UserModel.findOne({ phoneNumber: username }).select('+authentications.pinCode');

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const isValidPassword = user.authentications.pinCode === ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));

  if (!isValidPassword) {
    return { success: false, error: "Invalid password" };
  }

  const passportSigner = await createPassportSigner({ username });
  const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);

  return { success: true, user: user, smartAccountClient };
}

// export const getAccountClientForSmartWallet = async(signerInput:PassportSigner)=>{
//   const signer = signerInput as SmartAccountSigner;


//   const smartAccountClient = await createModularAccountAlchemyClient({
//       apiKey: "FUXZuAczhOuov14_rRnuvpoy2JpiOBiK",
//       chain: arbitrumSepolia,
//       signer: signer,
//       gasManagerConfig: {
//       policyId: "587f2a27-b5e0-4cff-a44e-8bf85a343dfe",
//       },
// });
// return smartAccountClient
// }
