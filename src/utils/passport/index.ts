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
   