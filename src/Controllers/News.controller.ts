import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import config from "../config";

interface NewsData {
  status: string;
  totalResults: number;
  articles: {
    source: {
      id: string;
      name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }[];
}

export const getNews = async (req: Request, res: Response) => {
  const { topic } = req.query;
  const currentDate = new Date();

  const weekBackwards = new Date(currentDate.setDate(currentDate.getDate() - 7))
    .toISOString()
    .split("T")[0];

  try {
    const { data } = await axios.get<AxiosResponse<NewsData>>(
      `https://newsapi.org/v2/everything?q=${topic}&from=${weekBackwards}&sortBy=popularity&apiKey=${config.CRYPTO_NEWS_API_KEY}`
    );

    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
