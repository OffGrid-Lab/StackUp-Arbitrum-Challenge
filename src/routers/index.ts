import express from 'express';


import authentication from './authentication.js';
import ussdRouter from './ussdRouter.js';
import adminKey from './adminKey.js';
// import users from "./users";
// import ussd from "./ussd";
const router = express.Router();

export default (): express.Router => {
//   authentication(router);
//   users(router);
//   ussd(router);
authentication(router)
ussdRouter(router)
adminKey(router)


  return router;
};
