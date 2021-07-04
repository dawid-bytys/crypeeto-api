import { Request, Response } from "express";
import { WalletModel } from "../Models/Wallet.model";
import { CurrencyModel } from "../Models/Currency.model";
import { isDataValid, isPasswordValid } from "../utils/utils";
import axios from "axios";

// Types
interface ActualWallet {
  currency: string;
  currency_from: string;
  currency_to: string;
  currency_from_abbr: string;
  currency_to_abbr: string;
  amount: number;
}

interface NewWallet {
  currency: string;
}

export const createWallet = async (req: Request, res: Response) => {
  const user = req.user;
  const { currency }: NewWallet = req.body;

  // Check whether the user has provided valid data
  if (Object.keys(req.body).length === 0 || !currency)
    return res.status(400).send({ message: "Invalid input" });

  // Find cryptocurrency with provided type
  const specificCurrency = await CurrencyModel.findOne({ currency: currency });
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
    res.status(400).send({ message: err.toString() });
  }
};

export const updateWallet = async (req: Request, res: Response) => {
  const user = req.user;
  const type = req.params.type;
  const data: ActualWallet = req.body;

  switch (type) {
    case "add":
      // Check whether the user has provided any data
      if (Object.keys(data).length === 0 || !data.currency)
        return res.status(400).send({ message: "Invalid input" });

      // Find cryptocurrency with provided type
      const specificCurrency = await CurrencyModel.findOne({
        currency: data.currency,
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
              amount: data.amount,
            },
          }
        );

        res
          .status(200)
          .send({ message: "Your wallet has been successfully updated" });
      } catch (err) {
        res.status(400).send({ message: err.toString() });
      }
      break;
    case "exchange":
      // Check whether the user has provided any data
      if (Object.keys(data).length === 0 || isDataValid(data))
        return res.status(400).send({ message: "Invalid input" });

      // Find cryptocurrency with provided type
      const currencyFrom = await CurrencyModel.findOne({
        currency: data.currency_from,
      });
      if (!currencyFrom)
        return res.status(400).send({ message: "Invalid currency" });

      // Find cryptocurrency with provided type
      const currencyTo = await CurrencyModel.findOne({
        currency: data.currency_to,
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
      if (walletFrom.amount < data.amount)
        return res
          .status(400)
          .send({ message: "Insufficient funds in your account" });

      try {
        const response = await axios.get(
          `https://api.twelvedata.com/currency_conversion?symbol=${data.currency_from_abbr}/${data.currency_to_abbr}&amount=${data.amount}&apikey=${process.env.TWELVE_DATA_API_KEY}`
        );

        await WalletModel.updateOne(
          {
            user_id: user._id,
            currency_id: currencyFrom._id,
          },
          {
            $inc: {
              amount: -data.amount,
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
              amount: response.data.amount,
            },
          }
        );

        res
          .status(200)
          .send({ message: "Your wallet has been successfully updated" });
      } catch (err) {
        res.status(400).send({ message: err.toString() });
      }
      break;
    default:
      res.status(404).send({ message: "Invalid endpoint" });
      break;
  }
};
