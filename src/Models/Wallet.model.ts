import mongoose, { Schema } from "mongoose";

interface Wallet {
  id_user: mongoose.Schema.Types.ObjectId;
  Bitcoin: Number;
  Ethereum: Number;
  Ripple: Number;
  Tether: Number;
  Stellar: Number;
}

const WalletSchema = new Schema({
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
