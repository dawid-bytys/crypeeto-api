import mongoose, { Schema } from "mongoose";

interface Currency {
  currency: string;
  abbreviation: string;
}

const CurrencySchema = new Schema<Currency>({
  currency: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
  },
});

export const CurrencyModel = mongoose.model<Currency>(
  "Currency",
  CurrencySchema,
  "currencies"
);
