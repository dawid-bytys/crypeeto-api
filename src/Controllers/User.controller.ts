import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../Models/User.model";
import { isPasswordValid, isEmailValid } from "../utils/utils";
import { WalletModel } from "../Models/Wallet.model";
import { CurrencyModel } from "../Models/Currency.model";

// Types
interface User {
  username: string;
  password: string;
  email: string;
}

interface CallbackData {
  username: string;
  email: string;
  profile_img: string;
  wallets: {
    currency: string;
    amount: number;
  }[];
}

// Register function
export const register = async (req: Request, res: Response) => {
  const { username, password, email }: User = req.body;

  // Check whether the user has provided valid data
  if (Object.keys(req.body).length === 0 || !username || !password || !email)
    return res.status(400).send({ message: "Invalid input" });

  // Validate provided password
  if (isPasswordValid(password))
    return res
      .status(400)
      .send({ message: "Your password doesn't match the requirements" });

  // Validate provided email
  if (isEmailValid(email))
    return res
      .status(400)
      .send({ message: "Your e-mail doesn't match the requirements" });

  // Check whether the email exists in the database
  const emailExists = await UserModel.findOne({ email: email });
  if (emailExists)
    return res
      .status(400)
      .send({ message: "Username or E-mail is already in use" }); // Prevent from easier bruteforcing

  // Check whether the username exists in the database
  const usernameExists = await UserModel.findOne({ username: username });
  if (usernameExists)
    return res
      .status(400)
      .send({ message: "Username or E-mail is already in use" }); // Prevent from easier bruteforcing

  // Encrypt the provided password
  const encryptedPassword = bcrypt.hashSync(password, 16);

  // Create a new User model
  const NewUser = new UserModel({
    username: username,
    email: email,
    password: encryptedPassword,
  });

  // Try to save the user in the database
  try {
    await NewUser.save();

    res.status(200).send({ message: "Successfully registered" });
  } catch (err) {
    res.status(err.statusCode).send({ message: err.toString() });
  }
};

// Login function
export const login = async (req: Request, res: Response) => {
  const { username, password }: Omit<User, "email"> = req.body;

  // Check whether the user has provided valid data
  if (Object.keys(req.body).length === 0 || !username || !password)
    return res.status(400).send({ message: "Invalid input" });

  // Check whether the username exists in the database
  const user = await UserModel.findOne({ username: username });
  if (!user)
    return res.status(400).send({ message: "Invalid username or password" }); // Prevent from easier bruteforcing

  // Check whether the provided password match password in the databse
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).send({ message: "Invalid username or password" }); // Prevent from easier bruteforcing

  // Generate the accessToken
  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "6h" }
  );

  // Send user his accessToken
  res.status(200).send({
    access_token: accessToken,
  });
};

// Authentication function for the front-end purposes
export const authentication = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  // Check whether the accessToken exists
  if (!accessToken)
    return res.status(401).send({
      is_authorized: false,
    });

  try {
    // Decode the token
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_TOKEN_SECRET
    ) as any;

    // Check whether the token has already expired
    const user = await UserModel.findOne({
      _id: decodedToken._id,
    });
    if (!user)
      return res.status(401).send({
        is_authorized: false,
      });

    // Send authorization
    res.status(200).send({
      is_authorized: true,
    });
  } catch (err) {
    res.status(401).send({
      is_authorized: false,
    });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  const user = req.user;

  // Try to get user
  const userData = await UserModel.findOne({
    _id: user._id,
  });

  // Try to get user's wallets
  const wallets = await WalletModel.find({
    user_id: user._id,
  });
  if (!wallets)
    return res.status(400).send({ message: "No wallets was found" });

  // Try to get all matching currencies
  const matchingCurrencies = await CurrencyModel.find({
    _id: {
      $in: wallets.map(x => x.currency_id),
    },
  });

  // Create a structure of callback data
  const callbackData: CallbackData = {
    username: userData.username,
    email: userData.email,
    profile_img: userData.profile_img,
    wallets: wallets.map(x => ({
      currency: matchingCurrencies.find(
        i => i._id.toString() === x.currency_id.toString()
      ).currency,
      amount: x.amount,
    })),
  };

  res.status(200).send(callbackData);
};
