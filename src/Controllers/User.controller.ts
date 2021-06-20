import { Request, Response } from "express";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../Models/User.model";
import { isEmailValid, isPasswordValid } from "../utils";

interface User {
  username: string;
  email: string;
  password: string;
  profile_img: string;
}

export const register = (req: Request, res: Response) => {
  const { username, password, email }: User = req.body;

  if (
    username &&
    password &&
    email &&
    isEmailValid(email) &&
    isPasswordValid(password)
  ) {
    UserModel.findOne(
      { $or: [{ email: email }, { username: email }] },
      (err: any, user: User) => {
        if (err) res.status(503).json({ message: "Server error." });

        if (user) {
          res
            .status(401)
            .json({ message: "Username/e-mail is already in use." });
        } else {
          const encryptedPassword = bcrypt.hashSync(password, 16);

          const NewUser = new UserModel({
            username: username,
            email: email,
            password: encryptedPassword,
            profile_img: "",
          });

          NewUser.save(err => {
            if (err) res.status(503).json({ message: "Server error." });

            res.status(200).json({ message: "Successfully registered." });
          });
        }
      }
    );
  } else {
    res.status(401).json({ message: "Invalid input." });
  }
};

export const login = (req: Request, res: Response) => {
  const { username, password }: User = req.body.data;

  UserModel.findOne({ username: username }, async (err: any, user: User) => {
    if (err) res.status(503).json({ message: "Server error." });

    if (user) {
      const validPassword = bcrypt.compareSync(password, user.password);

      if (validPassword)
        res.send({
          username: user.username,
          email: user.email,
          profile_img: user.profile_img,
        });
      else {
        res.status(401).json({ message: "Invalid username or password." });
      }
    } else {
      res.status(401).json({ message: "Invalid username or password." });
    }
  });
};
