import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

interface CryptoData {
  meta: {
    symbol: string;
    interval: string;
    currency_base: string;
    currency_quote: string;
    exchange: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
  }[];
  status: string;
}

interface CryptoPrice {
  price: string;
}

export const getPrices = async (req: Request, res: Response) => {
  const { symbol, exchange, interval } = req.query;

  try {
    const { data } = await axios.get<AxiosResponse<CryptoData>>(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&exchange=${exchange}&interval=${interval}&apikey=${process.env.TWELVE_DATA_API_KEY}`
    );

    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

export const getLatestPrice = async (req: Request, res: Response) => {
  const { symbol, exchange } = req.query;

  try {
    const { data } = await axios.get<AxiosResponse<CryptoPrice>>(
      `https://api.twelvedata.com/price?symbol=${symbol}&exchange=${exchange}&apikey=${process.env.TWELVE_DATA_API_KEY}`
    );

    res.send(data);
  } catch (err) {
    console.log(err);
  }
};
