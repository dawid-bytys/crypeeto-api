import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";
import { registerValidation, loginValidation } from "../utils/utils";

interface User {
  username: string;
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response) => {
  const { username, password, email }: User = req.body;

  // Validate provided data
  if (registerValidation({ username, email, password }))
    return res.status(400).send({ message: "Invalid input" });

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

  // Encrypt provided password
  const encryptedPassword = bcrypt.hashSync(password, 16);

  // Create a new model
  const NewUser = new UserModel({
    username: username,
    email: email,
    password: encryptedPassword,
    profile_img: "user.png",
  });

  // Try to save the user in the database
  try {
    const savedUser = await NewUser.save();

    res.status(200).send({ message: "Successfully registered!" });
  } catch (err) {
    res.status(400).send({ message: err.toString() });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password }: User = req.body;

  // Validate provided data
  if (loginValidation({ username, password }))
    return res.status(400).send({ message: "Invalid input" });

  // Check whether the username exists in the database
  const user = await UserModel.findOne({ username: username });
  if (!user)
    return res.status(400).send({ message: "Invalid username or password" }); // Prevent from easier bruteforcing

  // Check whether provided password match password in the databse
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid)
    return res.status(400).send({ message: "Invalid username or password" }); // Prevent from easier bruteforcing

  // Generate an accessToken
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.JWT_TOKEN_SECRET || "",
    { expiresIn: "6h" }
  );

  // Assign the accessToken to the header and send the user their data
  res.status(200).header("x-access-token", accessToken).send({
    username: user.username,
    email: user.email,
    profile_img: user.profile_img,
    accessToken: accessToken,
  });
};

export const authentication = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  // Check whether the accessToken exists
  if (!accessToken) return res.status(400).send({ message: "Unauthorized" });

  res.status(200).send({
    accessToken: accessToken,
  });

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_TOKEN_SECRET || ""
    );

    // Check whether the token expired
    const user = await UserModel.findOne({
      username: (decodedToken as any).username,
    });
    if (!user)
      return res.status(400).send({ message: "The token has already expired" });

    // Send the user their data
    res.status(200).send({
      username: user.username,
      email: user.email,
      profile_img: user.profile_img,
    });
  } catch (err) {
    res.status(400).send({ messsage: "Unauthorized" });
  }
};
