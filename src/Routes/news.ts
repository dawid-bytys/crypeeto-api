import express from "express";
import { getNews } from "../Controllers/News.controller";

const newsRouter = express.Router();

newsRouter.get("/news", getNews);

export default newsRouter;
