import express from "express";
import UserController from "../controllers/user.controller";
import {
  createLinkToken,
  getAccessToken,
  getAccounts,
  getTransactions,
} from "../controllers/plaid.controller";
const router = express.Router();

//Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

//private routes
router.post("/create_link_token", createLinkToken);
router.post("/get_access_token", getAccessToken);
router.post("/accounts", getAccounts);
router.post("/transactions", getTransactions);
export default router;
