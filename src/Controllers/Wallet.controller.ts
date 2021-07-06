import { Request, Response } from "express";
import { WalletModel } from "../Models/Wallet.model";
import { CurrencyModel } from "../Models/Currency.model";
import { isDataValid, getAbbreviation } from "../utils/utils";
import axios from "axios";

// Types
interface WalletAdd {
  currency: string;
  amount: number;
}

interface WalletExchange {
  currency_from: string;
  currency_to: string;
  amount: number;
}

interface Exchange {
  symbol: string;
  rate: number;
  amount: number;
  timestamp: number;
}

// Create a new wallet
export const createWallet = async (req: Request, res: Response) => {
  const user = req.user;
  const { currency }: { currency: string } = req.body;

  // Check whether the user has provided valid data
  if (Object.keys(req.body).length === 0 || !currency)
    return res.status(400).send({ message: "Invalid input" });

  // Find cryptocurrency with provided type
  const specificCurrency = await CurrencyModel.findOne({
    currency: currency,
  });
  if (!specificCurrency)
    return res.status(400).send({ message: "Invalid input" });

  // Check whether the user already has a wallet with provided cryptocurrency type
  const wallet = await WalletModel.findOne({
    user_id: user._id,
    currency_id: specificCurrency._id,
  });
  if (wallet)
    return res.status(400).send({
      message: "You already have a wallet with provided cryptocurrency",
    });

  // Create a new wallet model
  const NewWallet = new WalletModel({
    user_id: user._id,
    currency_id: specificCurrency._id,
  });

  try {
    // Try to save the wallet
    await NewWallet.save();

    res
      .status(200)
      .send({ message: "Your wallet has been successfully created" });
  } catch (err) {
    res.status(err.statusCode).send({ message: err.toString() });
  }
};

// Update an existing wallet
export const updateWallet = async (req: Request, res: Response) => {
  const user = req.user;
  const type = req.params.type;

  switch (type) {
    case "add":
      const addData: WalletAdd = req.body;

      // Check whether the user has provided any data
      if (Object.keys(addData).length === 0 || !addData.currency)
        return res.status(400).send({ message: "Invalid input" });

      // Find cryptocurrency with provided type
      const specificCurrency = await CurrencyModel.findOne({
        currency: addData.currency,
      });
      if (!specificCurrency)
        return res.status(400).send({ message: "Invalid currency" });

      // Check whether the user has a wallet with provided cryptocurrency type
      const wallet = await WalletModel.findOne({
        user_id: user._id,
        currency_id: specificCurrency._id,
      });
      if (!wallet)
        return res.status(400).send({
          message: "Wallet couldn't be found",
        });

      try {
        await WalletModel.updateOne(
          {
            user_id: user._id,
            currency_id: specificCurrency._id,
          },
          {
            $inc: {
              amount: addData.amount,
            },
          }
        );

        res
          .status(200)
          .send({ message: "Your wallet has been successfully updated" });
      } catch (err) {
        res.status(err.statusCode).send({ message: err.toString() });
      }
      break;
    case "exchange":
      const exchangeData: WalletExchange = req.body;

      // Check whether the user has provided any data
      if (Object.keys(exchangeData).length === 0 || isDataValid(exchangeData))
        return res.status(400).send({ message: "Invalid input" });

      // Find cryptocurrency with provided type
      const currencyFrom = await CurrencyModel.findOne({
        currency: exchangeData.currency_from,
      });
      if (!currencyFrom)
        return res.status(400).send({ message: "Invalid currency" });

      // Find cryptocurrency with provided type
      const currencyTo = await CurrencyModel.findOne({
        currency: exchangeData.currency_to,
      });
      if (!currencyTo)
        return res.status(400).send({ message: "Invalid currency" });

      // Check whether the user has a wallet with provided cryptocurrency type
      const walletFrom = await WalletModel.findOne({
        user_id: user._id,
        currency_id: currencyFrom._id,
      });
      if (!walletFrom)
        return res.status(400).send({
          message: "Wallet couldn't be found",
        });

      // Check whether the user has a wallet with provided cryptocurrency type
      const walletTo = await WalletModel.findOne({
        user_id: user._id,
        currency_id: currencyTo._id,
      });
      if (!walletTo)
        return res.status(400).send({
          message: "Wallet couldn't be found",
        });

      // Check whether the user has enough amount of money available
      if (walletFrom.amount < exchangeData.amount)
        return res
          .status(400)
          .send({ message: "Insufficient funds in your account" });

      try {
        const { data } = await axios.get<Exchange>(
          `https://api.twelvedata.com/currency_conversion?symbol=${getAbbreviation(
            exchangeData.currency_from
          )}/${getAbbreviation(exchangeData.currency_to)}&amount=${
            exchangeData.amount
          }&apikey=${process.env.TWELVE_DATA_API_KEY}`
        );

        await WalletModel.updateOne(
          {
            user_id: user._id,
            currency_id: currencyFrom._id,
          },
          {
            $inc: {
              amount: -exchangeData.amount,
            },
          }
        );

        await WalletModel.updateOne(
          {
            user_id: user._id,
            currency_id: currencyTo._id,
          },
          {
            $inc: {
              amount: data.amount,
            },
          }
        );

        res
          .status(200)
          .send({ message: "Your wallet has been successfully updated" });
      } catch (err) {
        res.status(err.statusCode).send({ message: err.toString() });
      }
      break;
    default:
      res.status(404).send({ message: "Invalid endpoint" });
      break;
  }
};
