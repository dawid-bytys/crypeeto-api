import { Request, Response } from "express";
import { CurrencyModel } from "../Models/Currency.model";

/*
 *
 * THIS CONTROLLER IS FOR THE DEVELOPMENT PURPOSES ONLY
 *
 */

// Types
interface Currency {
  currency: string;
  abbreviation: string;
}

// Add new currency to the database
export const currencyAdd = async (req: Request, res: Response) => {
  const { currency, abbreviation }: Currency = req.body;

  // Check whether the user has provided any data
  if (Object.keys(req.body).length === 0 || !currency || !abbreviation)
    return res.status(400).send({ message: "Invalid input" });

  // Create a new currency model
  const NewCurrency = new CurrencyModel({
    currency: currency,
    abbreviation: abbreviation,
  });

  // Try to save a new currency to the database
  try {
    await NewCurrency.save();

    res.status(200).send({
      message: "A new currency has been successfully added to the database",
    });
  } catch (err) {
    res.status(400).send({ message: err.toString() });
  }
};
