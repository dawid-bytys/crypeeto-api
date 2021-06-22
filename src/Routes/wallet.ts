import express from "express";
import { updateWallet, createWallet } from "../controllers/Wallet.controller";
import { authenticateToken } from "../utils/auth";

const walletRouter = express.Router();

//walletRouter.post("/wallet", authenticateToken, updateWallet);
walletRouter.post("/wallet/create", authenticateToken, createWallet);

export default walletRouter;
