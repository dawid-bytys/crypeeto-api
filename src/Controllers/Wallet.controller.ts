import { Request, Response } from "express";
import { WalletModel } from "../models/Wallet.model";

interface ActualWallet {
  currency: string;
  currency_from: string;
  currency_to: string;
  amount: number;
}

interface NewWallet {
  currency: string;
  abbreviation: string;
}

export const createWallet = async (req: Request, res: Response) => {
  const user = req.user;
  const { currency, abbreviation }: NewWallet = req.body;

  // Check whether the user has provided any data
  if (Object.keys(req.body).length === 0)
    return res.status(400).send({ message: "Invalid input" });

  // Check whether the user has a wallet with provided cryptocurrency type
  const wallet = await WalletModel.findOne({
    user_id: user._id,
    currency: currency,
  });
  if (wallet)
    return res.status(400).send({
      message: "You already have a wallet with provided cryptocurrency",
    });

  try {
    // Create a new wallet model
    const NewWallet = new WalletModel({
      user_id: user._id,
      currency: currency,
      abbreviation: abbreviation,
    });

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
    } else {
      // Needs finishing
      await WalletModel.updateOne(
        {
          id_user: user._id,
        },
        {
          $inc: {
            [bodyData.currency_from]: -bodyData.amount,
          },
        }
      );
    }

    res
      .status(200)
      .send({ message: "Your wallet has been successfully updated!" });
  } catch (err) {
    res.status(400).send({ message: err.toString() });
  }
};
