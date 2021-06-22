import { Request, Response } from "express";
import { WalletModel } from "../models/Wallet.model";
import walletRouter from "../routes/wallet";

interface Wallet {
  currency: string;
  currency_from: string;
  currency_to: string;
  amount: number;
}

export const updateWallet = async (req: Request, res: Response) => {
  const user = req.user;
  const type = req.params.type;
  const bodyData: Wallet = req.body;

  // Check whether the object with data exists or whether its length is equal zero
  if (!bodyData || Object.keys(bodyData).length === 0)
    return res.status(400).send({ message: "Invalid input" });

  // Try to find a wallet which matches the user
  const wallet = await WalletModel.findOne({ id_user: user._id });
  if (!wallet)
    return res.status(400).send({ message: "Could find any wallet" });

  // Try to update the values
  try {
    if (type === "add") {
      await WalletModel.updateOne(
        {
          id_user: user._id,
        },
        {
          $inc: {
            [bodyData.currency]: bodyData.amount,
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
