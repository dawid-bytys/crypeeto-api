import express from "express";
import { updateWallet, createWallet } from "../Controllers/Wallet.controller";
import { authenticateToken } from "../utils/auth";

const walletRouter = express.Router();

walletRouter.post("/wallet/create", authenticateToken, createWallet);
walletRouter.post("/wallet/update/:type", authenticateToken, updateWallet);

export default walletRouter;
