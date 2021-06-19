import { Request, Response } from "express";
import crypto from "crypto";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../Models/User.model";

interface User {
  username: string;
  password: string;
  email: string;
  profile_img: string;
}

const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString("hex");
};

export const register = (req: Request, res: Response) => {
  const username: string = req.body.username;
  const email: string = req.body.email;
  const password: string = req.body.password;

  UserModel.findOne({ username: username }, (err: any, user: User) => {
    if (err) res.status(503).json({ message: "Server error." });

    if (user) {
      res.status(401).json({ message: "Provided user already exists." });
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
  });
};

export const login = (req: Request, res: Response) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  UserModel.findOne({ username: username }, async (err: any, user: User) => {
    if (err) res.status(503).json({ message: "Server error." });

    if (user) {
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword)
        res.status(401).json({ message: "Invalid username or password." });
      else {
        res.send({
          username: user.username,
          email: user.email,
          profile_img: user.profile_img,
        });
      }
    } else {
      res.status(401).json({ message: "Invalid username or password." });
    }
  });
};

/*
export const isAuthenticated = (req: Request, res: Response) => {};
*/
