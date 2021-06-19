import express from "express";
import newsRouter from "./news";
import cryptoRouter from "./crypto";

const router = express.Router();

router.use(newsRouter);
router.use(cryptoRouter);

export default router;
