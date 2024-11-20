import UssdMenu from "ussd-builder";
import { checkifUserExist,  getUserByPhoneNumber, saveUserInDBWithSmartWallet } from "../../dbServices/userService.js";
import { Sessions, RegisterUserPassportKeyReturn } from "@/utils/types.js";
import { authentication, confirmLogin, createNewSmartWallet, random } from "../../utils/auth_helpers/auth_helpers.js";
import { createPassportSigner, getAccountClientForSmartWallet, registerUser } from "../../utils/passport/passport.js";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy"
import { arbitrumSepolia, sepolia, SmartAccountSigner } from "@alchemy/aa-core"

export default (menu: UssdMenu, sessions: Sessions) => {
  
menu.state("confirm-pin", {
        run: () => {
            if (/^\d{4,}$/.test(menu.val)) {
                menu.con("Enter your pin again to confirm pin");
            } else {
                menu.end("Wrong password pattern. Start all over.");
            }
        },
        next: {
            "*\\d{4,}$": "signer-created",
        },
});

menu.state("signer-created", {
        run: async () => {
          
          
                const phoneNumber = menu.args.phoneNumber;
                
                const response = await registerUser({username:phoneNumber}) as RegisterUserPassportKeyReturn

                if(response && response?.result && response?.result?.account_id){
                    const passportSigner = await createPassportSigner({ username: phoneNumber });
                  
                      const smartAccountClient = await getAccountClientForSmartWallet(passportSigner) 

                    const address = await smartAccountClient.getAddress();
                    console.log(address, "smart contract wallet address")
                    const salt = random()
                    const userData = {
                        phoneNumber,
                        smartContractWallet:address,
                        passport_account_id:response?.result?.account_id,
                        passport_identifier_hash:response?.result?.identifier_hash,
                        authentications: {
                          pinCode: authentication(salt , menu.val),
                      
                          salt: salt,
                          sessionToken: ""
                        }

                    }
                    await saveUserInDBWithSmartWallet(userData)
                    menu.end(`passort ${address}`)
                }else{
                    menu.end("Network Error Kindly Try again")
                }
               
          
              
        },
        // next: {
        //     1: "Login Menu",
        // },
});

 

menu.state("login-pin-confirmation", {
        run: async () => {
            const response = await confirmLogin(menu.args.phoneNumber, menu.val);
            switch (response) {
                case "AUTHORIZED":
                    menu.con(`Access Granted! Select your option\n
              1. Continue to select tool`);
                    break;
                case "UNAUTHORIZED":
                    menu.con(`Unauthorized access. Please check your phone number and PIN. \n
              1. Try again`);
                    break;
                case "NONEXISTENT":
                    menu.con(`User does not exist. Please register first. \n
              1. Register`);
                    break;
                default:
                    menu.con(`An error occurred during login. Please try again later.\n
              1. Try again`);
                    break;
            }
        },
        next: {
            1: async () => {
                const response = await getUserByPhoneNumber(menu.args.phoneNumber);
                console.log(response?.smartContractWallet, "")
                if (response && response.smartContractWallet) {
                    return "main menu";
                } else {
                    return "try_login_again";
                }
            },
        },
});

menu.state("try_login_again", {
            run: () => {
                menu.con("Enter your pin to login");
            },
            next: {
                "*\\d{4}$": "login-pin-confirmation",
            },
})

};
