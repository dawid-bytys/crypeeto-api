import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { registerValidation, loginValidation } from "../utils/utils";

interface User {
  username: string;
  email: string;
  password: string;
  profile_img: string;
}

export const register = async (req: Request, res: Response) => {
  const { username, password, email }: User = req.body;

  // Validate provided data
  if (registerValidation({ username, email, password }))
    return res.status(400).send({ message: "Invalid input." });

  // Check whether an email exists in the database
  const emailExists = await UserModel.findOne({ email: email });
  if (emailExists)
    return res
      .status(400)
      .send({ message: "Username or E-mail is already in use." }); // Prevent from easier bruteforcing

  // Check whether a username exists in the database
  const usernameExists = await UserModel.findOne({ username: username });
  if (usernameExists)
    return res
      .status(400)
      .send({ message: "Username or E-mail is already in use." }); // Prevent from easier bruteforcing

  // Encrypt provided password
  const encryptedPassword = bcrypt.hashSync(password, 16);

  // Create a new model
  const NewUser = new UserModel({
    username: username,
    email: email,
    password: encryptedPassword,
  });

  // Try to save a user in the database
  try {
    const savedUser = await NewUser.save();

    res.status(200).send(savedUser);
  } catch (err) {
    res.status(400).send({ message: err.toString() });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password }: User = req.body;

  // Validate provided data
  if (loginValidation({ username, password }))
    return res.status(400).send({ message: "Invalid input." });

  // Check whether a username exists in the database
  const user = await UserModel.findOne({ username: username });
  if (!user)
    return res.status(400).send({ message: "Invalid username or password." }); // Prevent from easier bruteforcing

  // Check whether provided password match password in the databse
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid)
    return res.status(400).send({ message: "Invalid username or password." }); // Prevent from easier bruteforcing

  // Generate an accessToken and assign it to the header
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_TOKEN_SECRET || "",
    { expiresIn: "6h" }
  );

  // Assign an accessToken to the header and send a user their data
  res.status(200).header("authorization", accessToken).send(user);
};
