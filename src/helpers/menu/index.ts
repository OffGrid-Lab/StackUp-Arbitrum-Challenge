// import UssdMenu from "ussd-builder";
// import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"
// import axios from "axios";
// import { BigNumber, Contract, Wallet, ethers } from "ethers";
// import bn from 'bignumber.js'
// import { RegisterUserPassportKeyReturn, Sessions } from "@/utils/types.js";
// import rampmenu from "./rampmenu.js";
// import { checkifUserExist } from "@/dbServices/userService.js";
// import { asyncHandler } from "@/utils/constant/index.js";
// import { createPassportSigner, getAccountClientForSmartWallet, passport } from "@/utils/passport/passport.js";
// import { UserModel } from "@/models/userModel.js";
// import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
// import { authentication, confirmLogin, createNewSmartWallet, hashPassword, random } from "@/utils/auth_helpers/auth_helpers.js";
// import { convertPinToHex, registerUserToRegistry } from "@/utils/btcflip/index.js";

// export const menu = new UssdMenu();

// let sessions: Sessions = {};

// // menu.startState({
// //     run: async () => {
// //         const sessionId: string = menu.args.sessionId;
// //         const phoneNumber: string = menu.args.phoneNumber;
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }

// //         let user = await checkifUserExist(phoneNumber);

// //         if (!user) {
// //             menu.con(`Welcome ${phoneNumber} to Shika Wallet\n1. Register\n2. Exit`);
// //         } else {
// //             menu.con(`Welcome Back to Shika Wallet.\nKindly enter your 4-digit PIN to login:`);
// //         }
// //     },
// //     next: {
// //         "1": "register",
// //         "2": "exit",
// //         "*\\d{4}$": "login"
// //     }
// // });

// // menu.state("register", {
// //     run: () => {
// //         menu.con("Enter your National ID:");
// //     },
// //     next: {
// //         "*[a-zA-Z0-9]+": "register_firstname"
// //     }
// // });

// // menu.state("register_firstname", {
// //     run: () => {
// //         const sessionId = menu.args.sessionId!;
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }
// //         sessions[sessionId].nationalId = menu.val;
// //         menu.con("Enter your First Name:");
// //     },
// //     next: {
// //         "*[a-zA-Z]+": "register_lastname"
// //     }
// // });

// // menu.state("register_lastname", {
// //     run: () => {
// //         const sessionId = menu.args.sessionId!;
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }
// //         sessions[sessionId].firstName = menu.val;
// //         menu.con("Enter your Last Name:");
// //     },
// //     next: {
// //         "*[a-zA-Z]+": "register_pin"
// //     }
// // });

// // menu.state("register_pin", {
// //     run: () => {
// //         const sessionId = menu.args.sessionId!;
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }
// //         sessions[sessionId].lastName = menu.val;
// //         menu.con("Create a 4-digit PIN:");
// //     },
// //     next: {
// //         "*\\d{4}$": "register_confirm_pin"
// //     }
// // });

// // menu.state("register_confirm_pin", {
// //     run: () => {
// //         const sessionId = menu.args.sessionId!;
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }
// //         sessions[sessionId].pin = menu.val;
// //         menu.con("Confirm your 4-digit PIN:");
// //     },
// //     next: {
// //         "*\\d{4}$": "process_registration"
// //     }
// // });

// // menu.state("process_registration", {
// //     run: async () => {
// //         const sessionId = menu.args.sessionId;
// //         const session = sessions[sessionId];
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }
// //         const firstPin = sessions[sessionId].pin!;
// //         if (firstPin !== menu.val) {
// //             menu.con("PINs do not match. Please try again.\n1. Retry\n2. Exit");
// //             return;
// //         }

// //         try {
// //             await passport.setupEncryption();
// //             const userInput = {
// //                 username: menu.args.phoneNumber!,
// //                 password: firstPin!,
// //             };

// //             const responses = await passport.delegatedRegisterAccount(userInput);
// //             passport.setUserData(userInput);

// //             const passportSigner = await createPassportSigner({ username: userInput.username });
// //             const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
// //             const address = await smartAccountClient.getAddress();
// //             const pinCodes = hashPassword(firstPin);

// //             await Promise.all([
// //                 UserModel.create({
// //                     phoneNumber: menu.args.phoneNumber!,
// //                     passport_account_id: responses?.result?.account_id!,
// //                     passport_identifier_hash: responses?.result?.identifier_hash!,
// //                     smartContractWallet: address!,
// //                     authentications: {
// //                         pinCode: convertPinToHex(pinCodes),
// //                         salt: "",
// //                     }
// //                 }),
// //                 registerUserToRegistry(
// //                     passportSigner,
// //                     sessions[sessionId].nationalId,
// //                     sessions[sessionId].firstName,
// //                     sessions[sessionId].lastName,
// //                     convertPinToHex(pinCodes),
// //                     BigInt(menu.args.phoneNumber!)
// //                 )
// //             ]);

// //             menu.con("Registration successful! You can now log in.\n1. Login\n2. Exit");
// //         } catch (error) {
// //             console.error("Registration error:", error);
// //             menu.con("An error occurred during registration. Please try again later.\n1. Retry\n2. Exit");
// //         }
// //     },
// //     next: {
// //         "1": "login",
// //         "2": "exit"
// //     }
// // });

// // menu.state("login", {
// //     run: async () => {
// //         const sessionId = menu.args.sessionId!;
// //         if (!sessionId) {
// //             menu.end("Session is over");
// //             return;
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {};
// //         }
// //         const phoneNumber = menu.args.phoneNumber;
// //         const enteredPin = menu.val;

// //         const user = await UserModel.findOne({ phoneNumber }).select('+authentications.pinCode');

// //         if (!user) {
// //             menu.con("User not found. Please register first.\n1. Register\n2. Exit");
// //             return;
// //         }

// //         const storedPinBytes = user.authentications.pinCode;
// //         const enteredPinBytes = convertPinToHex(hashPassword(enteredPin));
// //         console.log(storedPinBytes, "storedPinBytes")
// //         console.log(enteredPinBytes, "from input")
// //         console.log(storedPinBytes === enteredPinBytes)
// //         if (true) {
// //             sessions[sessionId].authenticated = true;
// //             menu.go("main_menu");
// //         } else {
// //             menu.con("Incorrect PIN. Please try again or exit.\n1. Retry\n2. Exit");
// //         }
// //     },
// //     next: {
// //         "1": "login",
// //         "2": "exit"
// //     }
// // });
// // menu.state("main_menu", {
// //     run: () => {
// //         const sessionId = menu.args.sessionId!;
// //         if (!sessionId) {
// //             menu.end("session is over")
// //             return
// //         }
// //         if (!sessions[sessionId]) {
// //             sessions[sessionId] = {}
// //         }
// //         // if (!sessions[sessionId].authenticated) {
// //         //     menu.end("Authentication required. Please login first.");
// //         //     return;
// //         // }
// //     }
// // });





// menu.startState({
//     run: async () => {
//         const sessionId: string = menu.args.sessionId;
//         const phoneNumber: string = menu.args.phoneNumber;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }

//         let user = await checkifUserExist(phoneNumber);

//         if (!user) {
//             menu.con(`Welcome ${phoneNumber} to Shika Wallet\n1. Register\n2. Exit`);
//         } else {
//             menu.con(`Welcome Back to Shika Wallet.\nKindly enter your 4-digit PIN to login:`);
//         }
//     },
//     next: {
//         "1": "register",
//         "2": "exit",
//         "*\\d{4}$": "login"
//     }
// });

// menu.state("register", {
//     run: () => {
//         menu.con("Enter your National ID:");
//     },
//     next: {
//         "*[a-zA-Z0-9]+": "register_firstname"
//     }
// });

// menu.state("register_firstname", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].nationalId = menu.val;
//         menu.con("Enter your First Name:");
//     },
//     next: {
//         "*[a-zA-Z]+": "register_lastname"
//     }
// });

// menu.state("register_lastname", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].firstName = menu.val;
//         menu.con("Enter your Last Name:");
//     },
//     next: {
//         "*[a-zA-Z]+": "register_pin"
//     }
// });

// menu.state("register_pin", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].lastName = menu.val;
//         menu.con("Create a 4-digit PIN:");
//     },
//     next: {
//         "*\\d{4}$": "register_confirm_pin"
//     }
// });

// menu.state("register_confirm_pin", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].pin = menu.val;
//         menu.con("Confirm your 4-digit PIN:");
//     },
//     next: {
//         "*\\d{4}$": "process_registration"
//     }
// });

// menu.state("process_registration", {
//     run: async () => {
//         const sessionId = menu.args.sessionId;
//         const session = sessions[sessionId];
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         const firstPin = sessions[sessionId].pin!;
//         if (firstPin !== menu.val) {
//             menu.con("PINs do not match. Please try again.\n1. Retry\n2. Exit");
//             return;
//         }

//         try {
//             const phoneNumber = menu.args.phoneNumber!;
//             const salt = random();
//             const pinHash = authentication(salt, firstPin);


//              await passport.setupEncryption();
//              const userInput = {
//                  username: menu.args.phoneNumber!,
//                  password: firstPin!,
//              };

//               await passport.delegatedRegisterAccount(userInput);
//              passport.setUserData(userInput);

//              const passportSigner = await createPassportSigner({ username: userInput.username });
//              const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
//              const address = await smartAccountClient.getAddress();



//             await registerUserToRegistry(
//                 address,
//                 sessions[sessionId].nationalId,
//                 sessions[sessionId].firstName,
//                 sessions[sessionId].lastName,
//                 pinHash,
//                 BigInt(phoneNumber)
//             );

//             menu.con("Registration successful! You can now log in.\n1. Login\n2. Exit");
//         } catch (error) {
//             console.error("Registration error:", error);
//             menu.con("An error occurred during registration. Please try again later.\n1. Retry\n2. Exit");
//         }
//     },
//     next: {
//         "1": "login",
//         "2": "exit"
//     }
// });

// menu.state("login", {
//     run: async () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         const phoneNumber = menu.args.phoneNumber;
//         const enteredPin = menu.val;

//         const loginResult = await confirmLogin(phoneNumber, enteredPin);

//         if (loginResult === "AUTHORIZED") {
//             sessions[sessionId].authenticated = true;
//             menu.go("main_menu");
//         } else if (loginResult === "NONEXISTENT") {
//             menu.con("User not found. Please register first.\n1. Register\n2. Exit");
//         } else {
//             menu.con("Incorrect PIN. Please try again or exit.\n1. Retry\n2. Exit");
//         }
//     },
//     next: {
//         "1": "login",
//         "2": "exit"
//     }
// });






// menu.state("exit", {
//     run: () => {
//         menu.end("Thank you for using Shika Wallet. Goodbye!");
//     }
// });






import UssdMenu from "ussd-builder";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"
import axios from "axios";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import bn from 'bignumber.js'
import { RegisterUserPassportKeyReturn, Sessions } from "@/utils/types.js";
import rampmenu from "./rampmenu.js";
import { checkifUserExist } from "@/dbServices/userService.js";
import { asyncHandler } from "@/utils/constant/index.js";
import { createPassportSigner, getAccountClientForSmartWallet, passport } from "@/utils/passport/passport.js";
import { UserModel } from "@/models/userModel.js";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { authentication, confirmLogin, createNewSmartWallet, hashPassword, random } from "@/utils/auth_helpers/auth_helpers.js";
import { convertPinToHex, registerUserToRegistry } from "@/utils/btcflip/index.js";

export const menu = new UssdMenu();

let sessions: Sessions = {};

// menu.startState({
//     run: async () => {
//         const sessionId: string = menu.args.sessionId;
//         const phoneNumber: string = menu.args.phoneNumber;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }

//         let user = await checkifUserExist(phoneNumber);

//         if (!user) {
//             menu.con(`Welcome ${phoneNumber} to Shika Wallet\n1. Register\n2. Exit`);
//         } else {
//             menu.con(`Welcome Back to Shika Wallet.\nKindly enter your 4-digit PIN to login:`);
//         }
//     },
//     next: {
//         "1": "register",
//         "2": "exit",
//         "*\\d{4}$": "login"
//     }
// });

// menu.state("register", {
//     run: () => {
//         menu.con("Enter your National ID:");
//     },
//     next: {
//         "*[a-zA-Z0-9]+": "register_firstname"
//     }
// });

// menu.state("register_firstname", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].nationalId = menu.val;
//         menu.con("Enter your First Name:");
//     },
//     next: {
//         "*[a-zA-Z]+": "register_lastname"
//     }
// });

// menu.state("register_lastname", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].firstName = menu.val;
//         menu.con("Enter your Last Name:");
//     },
//     next: {
//         "*[a-zA-Z]+": "register_pin"
//     }
// });

// menu.state("register_pin", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].lastName = menu.val;
//         menu.con("Create a 4-digit PIN:");
//     },
//     next: {
//         "*\\d{4}$": "register_confirm_pin"
//     }
// });

// menu.state("register_confirm_pin", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         sessions[sessionId].pin = menu.val;
//         menu.con("Confirm your 4-digit PIN:");
//     },
//     next: {
//         "*\\d{4}$": "process_registration"
//     }
// });

// menu.state("process_registration", {
//     run: async () => {
//         const sessionId = menu.args.sessionId;
//         const session = sessions[sessionId];
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         const firstPin = sessions[sessionId].pin!;
//         if (firstPin !== menu.val) {
//             menu.con("PINs do not match. Please try again.\n1. Retry\n2. Exit");
//             return;
//         }

//         try {
//             await passport.setupEncryption();
//             const userInput = {
//                 username: menu.args.phoneNumber!,
//                 password: firstPin!,
//             };

//             const responses = await passport.delegatedRegisterAccount(userInput);
//             passport.setUserData(userInput);

//             const passportSigner = await createPassportSigner({ username: userInput.username });
//             const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);
//             const address = await smartAccountClient.getAddress();
//             const pinCodes = hashPassword(firstPin);

//             await Promise.all([
//                 UserModel.create({
//                     phoneNumber: menu.args.phoneNumber!,
//                     passport_account_id: responses?.result?.account_id!,
//                     passport_identifier_hash: responses?.result?.identifier_hash!,
//                     smartContractWallet: address!,
//                     authentications: {
//                         pinCode: convertPinToHex(pinCodes),
//                         salt: "",
//                     }
//                 }),
//                 registerUserToRegistry(
//                     passportSigner,
//                     sessions[sessionId].nationalId,
//                     sessions[sessionId].firstName,
//                     sessions[sessionId].lastName,
//                     convertPinToHex(pinCodes),
//                     BigInt(menu.args.phoneNumber!)
//                 )
//             ]);

//             menu.con("Registration successful! You can now log in.\n1. Login\n2. Exit");
//         } catch (error) {
//             console.error("Registration error:", error);
//             menu.con("An error occurred during registration. Please try again later.\n1. Retry\n2. Exit");
//         }
//     },
//     next: {
//         "1": "login",
//         "2": "exit"
//     }
// });

// menu.state("login", {
//     run: async () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("Session is over");
//             return;
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {};
//         }
//         const phoneNumber = menu.args.phoneNumber;
//         const enteredPin = menu.val;

//         const user = await UserModel.findOne({ phoneNumber }).select('+authentications.pinCode');

//         if (!user) {
//             menu.con("User not found. Please register first.\n1. Register\n2. Exit");
//             return;
//         }

//         const storedPinBytes = user.authentications.pinCode;
//         const enteredPinBytes = convertPinToHex(hashPassword(enteredPin));
//         console.log(storedPinBytes, "storedPinBytes")
//         console.log(enteredPinBytes, "from input")
//         console.log(storedPinBytes === enteredPinBytes)
//         if (true) {
//             sessions[sessionId].authenticated = true;
//             menu.go("main_menu");
//         } else {
//             menu.con("Incorrect PIN. Please try again or exit.\n1. Retry\n2. Exit");
//         }
//     },
//     next: {
//         "1": "login",
//         "2": "exit"
//     }
// });
// menu.state("main_menu", {
//     run: () => {
//         const sessionId = menu.args.sessionId!;
//         if (!sessionId) {
//             menu.end("session is over")
//             return
//         }
//         if (!sessions[sessionId]) {
//             sessions[sessionId] = {}
//         }
//         // if (!sessions[sessionId].authenticated) {
//         //     menu.end("Authentication required. Please login first.");
//         //     return;
//         // }
//     }
// });





menu.startState({
    run: async () => {
        const sessionId: string = menu.args.sessionId;
        const phoneNumber: string = menu.args.phoneNumber;
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }

        let user = await checkifUserExist(phoneNumber);

        if (!user) {
            menu.con(`Welcome ${phoneNumber} to Shika Wallet\n1. Register\n2. Exit`);
        } else {
            menu.con(`Welcome Back to Shika Wallet.\nKindly enter your 4-digit PIN to login:`);
        }
    },
    next: {
        "1": "register",
        "2": "exit",
        "*\\d{4}$": "login"
    }
});

menu.state("register", {
    run: () => {
        menu.con("Enter your National ID:");
    },
    next: {
        "*[a-zA-Z0-9]+": "register_firstname"
    }
});

menu.state("register_firstname", {
    run: () => {
        const sessionId = menu.args.sessionId!;
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }
        sessions[sessionId].nationalId = menu.val;
        menu.con("Enter your First Name:");
    },
    next: {
        "*[a-zA-Z]+": "register_lastname"
    }
});

menu.state("register_lastname", {
    run: () => {
        const sessionId = menu.args.sessionId!;
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }
        sessions[sessionId].firstName = menu.val;
        menu.con("Enter your Last Name:");
    },
    next: {
        "*[a-zA-Z]+": "register_pin"
    }
});

menu.state("register_pin", {
    run: () => {
        const sessionId = menu.args.sessionId!;
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }
        sessions[sessionId].lastName = menu.val;
        menu.con("Create a 4-digit PIN:");
    },
    next: {
        "*\\d{4}$": "register_confirm_pin"
    }
});

menu.state("register_confirm_pin", {
    run: () => {
        const sessionId = menu.args.sessionId!;
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }
        sessions[sessionId].pin = menu.val;
        menu.con("Confirm your 4-digit PIN:");
    },
    next: {
        "*\\d{4}$": "process_registration"
    }
});

menu.state("process_registration", {
    run: async () => {
        const sessionId = menu.args.sessionId;
        const session = sessions[sessionId];
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }
        const firstPin = sessions[sessionId].pin!;
        if (firstPin !== menu.val) {
            menu.con("PINs do not match. Please try again.\n1. Retry\n2. Exit");
            return;
        }

        try {
            const phoneNumber = menu.args.phoneNumber!;
            const salt = random();
            const pinHash = authentication(salt, firstPin);


            await passport.setupEncryption();
            const userInput = {
                username: menu.args.phoneNumber!,
                password: firstPin!,
            };

            const responses = await passport.delegatedRegisterAccount(userInput);
            passport.setUserData(userInput);

            const passportSigner = await createPassportSigner({ username: userInput.username });
            const smartAccountClient = await getAccountClientForSmartWallet(passportSigner);

            const address = await smartAccountClient.getAddress();
            await UserModel.create({
                phoneNumber: menu.args.phoneNumber!,
                passport_account_id: responses?.result?.account_id!,
                passport_identifier_hash: responses?.result?.identifier_hash!,
                smartContractWallet: address!,
                authentications: {
                    pinCode: pinHash,
                    salt: salt,
                }
            }),
                await registerUserToRegistry(
                    passportSigner,
                    sessions[sessionId].nationalId,
                    sessions[sessionId].firstName,
                    sessions[sessionId].lastName,
                    convertPinToHex(pinHash),
                    BigInt(phoneNumber)
                );

            menu.end("Registration successful! You can now log in.");
        } catch (error) {
            console.error("Registration error:", error);
            menu.con("An error occurred during registration. Please try again later.\n1. Retry\n2. Exit");
        }
    },
    next: {
        "1": "login",
        "2": "exit"
    }
});

menu.state("login", {
    run: async () => {
        const sessionId = menu.args.sessionId!;
        if (!sessionId) {
            menu.end("Session is over");
            return;
        }
        if (!sessions[sessionId]) {
            sessions[sessionId] = {};
        }
        const phoneNumber = menu.args.phoneNumber;
        const enteredPin = menu.val;

        const loginResult = await confirmLogin(phoneNumber, enteredPin);

        if (loginResult === "AUTHORIZED") {
            console.log("I am authorized but I have to change the logic ")
            sessions[sessionId].authenticated = true;
            menu.con("Press 1 to Continue ");
        } else if (loginResult === "NONEXISTENT") {
            menu.end("User not found. Please register first.");
        } else {
            menu.con("Incorrect PIN. Please try again or exit.\n1. Retry\n2. Exit");
        }
    },
    next: {

        1: async () => {
            const sessionId = menu.args.sessionId!;
            if (!sessionId) {
                
                return;
            }
            if (!sessions[sessionId]) {
                sessions[sessionId] = {};
                return
            }


            if (sessions[sessionId].authenticated) {
                return "main menu";
            } else {
                return "login";
            }
        },
    }
});


rampmenu(menu, sessions)



menu.state("exit", {
    run: () => {
        menu.end("Thank you for using Shika Wallet. Goodbye!");
    }
});

