import express, { NextFunction, Response, Request } from "express";


import { stateInstance } from "../helpers/state/StateManager.js";
import { menu } from "../helpers/menu/index.js";


export const ussdControl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const greeterSmartContractInstance = new ethers.Contract(CONTRACT_ADDRESS, )
  console.log(req.body, "REQUEST BODY");
  let args;

  const contentType = req.headers["content-type"];
  if (contentType === "application/xml" || contentType === "text/xml") {
    // Handle XML request
    const parsedXmlBody = req.body; // The body is already parsed by xmlparser middleware

    /**
     * ussd: {
    phonenumber: [ '264816374580' ],      '264816374580'
    sessionid: [ 'ATUid_8342b8ebeb515d58c02568089f05b650' ],
    servicecode: [ '*384*32006#' ],
    text: [ 'sooo' ]
  }

  
     */
    // Extract the relevant data from the parsed XML

    
    args = {
      phoneNumber: parsedXmlBody.ussd.phonenumber[0],
      sessionId: parsedXmlBody.ussd.sessionid[0],
      serviceCode: parsedXmlBody.ussd.servicecode[0],
      text: parsedXmlBody.ussd.text[0],
    };

    const sessionId = args.sessionId // Assuming SESSIONID exists in the request body
  

    // Add new user text to the StateManager for the specific session
    stateInstance.addState(sessionId, args.text)


    console.log(args.text, "is it parsed?")


  } else {
    // Handle JSON request
    args = {
      phoneNumber: req.body.phoneNumber,
      sessionId: req.body.sessionId,
      serviceCode: req.body.serviceCode,
      text: req.body.text,
    };

    const sessionId = req.body.sessionid; // Assuming SESSIONID exists in the request body
  

    // Add new user text to the StateManager for the specific session
    stateInstance.addState(sessionId, req.body.text)


    /*  
         [
          {
            sessionId:{
              text:""
              firstname:""

          }
        }
         ]
    */


  }

 
  let resMsg = await menu.run(args);

  // Send the response as XML with the content type set to application/xml

  res.send(resMsg);
};
