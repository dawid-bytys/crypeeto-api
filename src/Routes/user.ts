import express from "express";
import { register, login } from "../Controllers/User.controller";

const userRouter = express.Router();

userRouter.post("/signin", register);
userRouter.post("/login", login);

export default userRouter;
