import express from "express";
import {
  register,
  login,
  authentication,
} from "../Controllers/User.controller";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/authentication", authentication);

export default userRouter;
