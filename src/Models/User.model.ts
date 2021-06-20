import mongoose, { Schema } from "mongoose";

interface User {
  username: string;
  password: string;
  email: string;
  profile_img: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile_img: {
    type: String,
    required: false,
  },
});

export const UserModel = mongoose.model<User>("user", UserSchema, "users");
