import express from "express";
import newsRouter from "./news";
import cryptoRouter from "./crypto";
import userRouter from "./user";

const router = express.Router();

router.use(newsRouter);
router.use(cryptoRouter);
router.use(userRouter);

export default router;
