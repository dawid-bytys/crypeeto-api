import express from "express";
import newsRouter from "./news";
import cryptoRouter from "./crypto";
import userRouter from "./user";
import walletRouter from "./wallet";

const router = express.Router();

router.use(newsRouter);
router.use(cryptoRouter);
router.use(userRouter);
router.use(walletRouter);

export default router;
