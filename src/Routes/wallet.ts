import express from "express";
import { updateWallet } from "../controllers/Wallet.controller";
import { authenticateToken } from "../utils/auth";

const walletRouter = express.Router();

walletRouter.post("/updateWallet/:type", authenticateToken, updateWallet);

export default walletRouter;
