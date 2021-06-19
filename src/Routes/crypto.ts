import express from "express";
import { getPrices, getLatestPrice } from "../Controllers/Crypto.controller";

const cryptoRouter = express.Router();

cryptoRouter.get("/time_series", getPrices);
cryptoRouter.get("/price", getLatestPrice);

export default cryptoRouter;
