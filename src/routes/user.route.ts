import express from "express";
import UserController from "../controllers/user.controller";
const router = express.Router();

//Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

export default router;
