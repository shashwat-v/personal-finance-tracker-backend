import express from "express";
import UserController from "../controllers/user.controller";
import {
  createLinkToken,
  getAccessToken,
  getAccounts,
  getTransactions,
} from "../controllers/plaid.controller";
import {
  generateAuthCode,
  setAccessToken,
} from "../controllers/fyers.controller";
import { googleAuth } from "../controllers/googelauth.controller";
const router = express.Router();

//Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
//google auth
router.post("/google", googleAuth);

//plaid routes
router.post("/create_link_token", createLinkToken);
router.post("/get_access_token", getAccessToken);
router.post("/accounts", getAccounts);
router.post("/transactions", getTransactions);

//fyers stock-holdings access (specific for now!)
router.get("/holdings", generateAuthCode);
router.post("/holdings/:auth_code", setAccessToken);

export default router;
