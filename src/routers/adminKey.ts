import { KeySigner } from "@0xpass/key-signer";
import { Network, Passport } from "@0xpass/passport";
import { Router } from "express";
// import { createPassportSigner } from "../utils/passport/passport";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy"
import { arbitrumSepolia, sepolia, SmartAccountSigner } from "@alchemy/aa-core"
// import {passport} from "../utils/passport/passport.js"
import {  setupAdminKey ,  createSmartWallet} from "../controllers/usersController.js";



export default(router:Router)=>{

router.post("/admin_key", setupAdminKey);
router.post("/create_smart_wallet", createSmartWallet);
 
}


