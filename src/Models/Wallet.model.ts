import mongoose, { Schema } from "mongoose";

interface Wallet {
  id_user: mongoose.Types.ObjectId;
  Bitcoin: number;
  Ethereum: number;
  Ripple: number;
  Tether: number;
  Stellar: number;
}

const WalletSchema = new Schema<Wallet>({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Bitcoin: {
    type: Number,
    required: true,
    default: 0,
  },
  Ethereum: {
    type: Number,
    required: true,
    default: 0,
  },
  Ripple: {
    type: Number,
    required: true,
    default: 0,
  },
  Tether: {
    type: Number,
    required: true,
    default: 0,
  },
  Stellar: {
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
