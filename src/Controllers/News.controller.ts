import { Request, Response } from "express";
import axios from "axios";

// Types
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

// Fetch news about provided topic from 3rd party API
export const getNews = async (req: Request, res: Response) => {
  const { topic } = req.query;

  // Check whether the user has provided valid data
  if (Object.keys(req.query).length === 0 || !topic)
    return res.status(400).send({ message: "Invalid data" });

  // Get last week's date
  const currentDate = new Date();
  const weekPeriod = new Date(currentDate.setDate(currentDate.getDate() - 7))
    .toISOString()
    .split("T")[0];

  // Try to fetch news data
  try {
    const { data } = await axios.get<NewsData>(
      `https://newsapi.org/v2/everything?q=${topic}&from=${weekPeriod}&sortBy=popularity&apiKey=${process.env.CRYPTO_NEWS_API_KEY}`
    );

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.toString() });
  }
};
