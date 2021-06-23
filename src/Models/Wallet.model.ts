import mongoose, { Schema } from "mongoose";

interface Wallet {
  user_id: mongoose.Types.ObjectId;
  currency_id: mongoose.Types.ObjectId;
  amount: number;
}

const WalletSchema = new Schema<Wallet>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const WalletModel = mongoose.model<Wallet>(
  "Wallet",
  WalletSchema,
  "wallets"
);
