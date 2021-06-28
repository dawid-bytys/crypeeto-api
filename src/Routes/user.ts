import express from "express";
import {
  register,
  login,
  authentication,
  getUserData,
} from "../Controllers/User.controller";
import { authenticateToken } from "../utils/auth";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/authentication", authentication);
userRouter.get("/user", authenticateToken, getUserData);

export default userRouter;
