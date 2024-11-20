import { Router } from "express";

import { ussdControl } from "../controllers/ussdController.js";


export default (router:Router) =>{
    router.post("/ussd", ussdControl)

}