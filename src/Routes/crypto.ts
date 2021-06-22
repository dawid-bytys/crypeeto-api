import express from "express";
import { getPrices, getLatestPrice } from "../Controllers/Crypto.controller";
import { authenticateToken } from "../utils/auth";

const cryptoRouter = express.Router();

cryptoRouter.get("/time_series", authenticateToken, getPrices);
cryptoRouter.get("/price", authenticateToken, getLatestPrice);

export default cryptoRouter;
