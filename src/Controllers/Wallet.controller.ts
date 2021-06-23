import { Request, Response } from "express";
import { WalletModel } from "../Models/Wallet.model";
import { CurrencyModel } from "../Models/Currency.model";
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
  const bodyData: ActualWallet = req.body;

  // Check whether the user has provided any data
  if (Object.keys(bodyData).length === 0)
    return res.status(400).send({ message: "Invalid input" });

  // Try to find a wallet which matches the user
  const wallet = await WalletModel.findOne({ user_id: user._id });
  if (!wallet)
    return res.status(400).send({ message: "Couldn't find any wallet" });

  // Try to update the values
  try {
    if (type === "add") {
      await WalletModel.updateOne(
        {
          user_id: user._id,
          currency: bodyData.currency,
        },
        {
          $inc: {
            amount: bodyData.amount,
          },
        }
      );
    } else if (type === "exchange") {
      const { data } = await axios.get(
        `https://api.twelvedata.com/currency_conversion?symbol=${bodyData.currency_from_abbr}/${bodyData.currency_to_abbr}&amount=${bodyData.amount}&apikey=${process.env.TWELVE_DATA_API_KEY}`
      );

      await WalletModel.updateOne(
        {
          user_id: user._id,
          currency: bodyData.currency_from,
        },
        {
          $inc: {
            [bodyData.currency_from]: -bodyData.amount,
          },
        }
      );

      await WalletModel.updateOne(
        {
          user_id: user._id,
          currency: bodyData.currency_to,
        },
        {
          $inc: {
            [bodyData.currency_to]: data.amount,
          },
        }
      );
    } else {
      return res.status(400).send({ message: "Invalid url" });
    }

    res
      .status(200)
      .send({ message: "Your wallet has been successfully updated" });
  } catch (err) {
    res.status(400).send({ message: err.toString() });
  }
};
