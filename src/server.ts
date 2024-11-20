import express, { Request, Response, NextFunction } from "express"
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import * as dotenv from "dotenv";
import routers from "./routers/index.js";
import mongoose from "mongoose";
import path from "path";
import xmlparser from "express-xml-bodyparser";
import { errorHandler } from "./middlewares/errors.js";
dotenv.config()


// const ABI = [
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "num",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "store",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "retrieve",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]


const app = express()
const PORT = process.env.PORT || 3000
const ALCHEMY_KEY = process.env.ALCHEMY_KEY!;
const POLICY_ID= process.env.POLICY_ID!;




app.use(express.json());

// app.post("/register", async (req, res, next) => {
//   try {
    
//     const {phoneNumber, password}  = req.body

//     const userInput :UserInput = {
//       username: phoneNumber,
//       password: password
//     }

 
  
  


//     const result = await registerUser(userInput)
  
//     return res.json(result)
//   } catch (error) {
//     console.log(error)
//     return next(error)
//   }
// })

// app.post("/action", async (req, res, next) => {
//   try {

//     const {phoneNumber, password} = req.body
 

   
// // var encoded = btoa(JSON.stringify(req.body))

//     const passportSigner = await createPassportSigner({
//       username: phoneNumber,
    
//     })

//     const signer = passportSigner as SmartAccountSigner
// // 0x6Dea11F729849AA59773BFCF42eE8336B301be1d
//     console.log(

//       "SIGNER", signer
//     )

//     const smartAccountClient = await createModularAccountAlchemyClient({
//       apiKey: "FUXZuAczhOuov14_rRnuvpoy2JpiOBiK",
//       chain: arbitrumSepolia,
//       signer: signer,
//       gasManagerConfig: {
//         policyId: "587f2a27-b5e0-4cff-a44e-8bf85a343dfe",
//       },
//     })

//     console.log()

//     const address = await smartAccountClient.getAddress()

//     // create a UO here

//     // Send a sponsored UO from your smart account like this:
//     const encodedFunctionData = encodeFunctionData({
//       abi: ABI,
//       functionName: "store",
//       args: [123], 
//     });

//     // Send a sponsored UO from your smart account
//     const { hash } = await smartAccountClient.sendUserOperation({
//       uo: {
//         target: "0x94cd827820a6eae7ef684db81f7d98d857960a3f",
//         data: encodedFunctionData,
//         value: BigInt(0),
//       },
//     });
   

//     return res.send({ address, hash:hash })
//   } catch (error) {
//     console.log(error)
//     return next(error)
//   }
// })



app.use(
  cors({
    credentials: true,
  })
);

app.use(xmlparser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


const MONGO_URL = process.env.MONGO_DB_DATABASE_URL!;



// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   if (process.env.NODE_ENV === "development") {
//     console.error(err)
//   }
//   res.status(500).send({
//     message: err.message,
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   })
// })








app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

console.log(MONGO_URL, "MONGGGGGGGGGGGGGGOO")
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));


app.use("/", routers());
app.get("/hello", async (req, res, next) => {
  try {
    return res.send("hello world")
  } catch (error) {
    console.log(error)
    return next(error)
  }
})

app.use(errorHandler)

// const envFilePath = path.resolve(__dirname, "../.env");
// dotenv.config({ path: envFilePath });
