import express from "express";
import { getPrices, getLatestPrice } from "../controllers/Crypto.controller";
import { authenticateToken } from "../utils/auth";

const cryptoRouter = express.Router();

cryptoRouter.get("/time_series", authenticateToken, getPrices);
cryptoRouter.get("/price", authenticateToken, getLatestPrice);

export default cryptoRouter;
