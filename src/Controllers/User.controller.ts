import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { isPasswordValid, isEmailValid } from "../utils/utils";

interface User {
  username: string;
  email: string;
  password: string;
}

// Register function
export const register = async (req: Request, res: Response) => {
  const { username, password, email }: User = req.body;

  // Check whether the user has provided any data
  if (Object.keys(req.body).length === 0)
    return res.status(400).send({ message: "Invalid input" });

  // Validate provided password
  if (!isPasswordValid(password))
    return res
      .status(400)
      .send({ message: "You password doesn't match the requirements" });

  // Validate provided email
  if (!isEmailValid(email))
    return res
      .status(400)
      .send({ message: "You e-mail doesn't match the requirements" });

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

  // Create the new User model
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
    res.status(400).send({ message: err.toString() });
  }
};

// Login function
export const login = async (req: Request, res: Response) => {
  const { username, password }: User = req.body;

  // Check whether the user has provided any data
  if (Object.keys(req.body).length === 0)
    return res.status(400).send({ message: "Invalid input" });

  // Check whether the username exists in the database
  const user = await UserModel.findOne({ username: username });
  if (!user)
    return res.status(400).send({ message: "Invalid username or password" }); // Prevent from easier bruteforcing

  // Check whether the provided password match password in the databse
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid)
    return res.status(400).send({ message: "Invalid username or password" }); // Prevent from easier bruteforcing

  // Generate the accessToken
  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_TOKEN_SECRET || "",
    { expiresIn: "6h" }
  );

  // Send user their data
  res.status(200).send({
    username: user.username,
    email: user.email,
    profile_img: user.profile_img,
    accessToken: accessToken,
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
      process.env.JWT_TOKEN_SECRET || ""
    );

    // Check whether the token has already expired
    const user = await UserModel.findOne({
      _id: (decodedToken as any)._id,
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
