import express from "express";
import { getNews } from "../controllers/News.controller";
import { authenticateToken } from "../utils/auth";

const newsRouter = express.Router();

newsRouter.get("/news", authenticateToken, getNews);

export default newsRouter;
