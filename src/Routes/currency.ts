import express from "express";
import { currencyAdd } from "../Controllers/Currency.controller";

const currencyRouter = express.Router();

currencyRouter.post("/currency/add", currencyAdd);

export default currencyRouter;
