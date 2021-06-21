import crypto from "crypto";
import RandExp from "randexp";

// Types
interface LoginData {
  username: string | undefined;
  password: string | undefined;
}

interface RegisterData extends LoginData {
  email: string | undefined;
}

// Function which generates random username
export const generateUsername = (): string => {
  return crypto.randomBytes(10).toString("hex");
};

// Function which generates random password which matches the regex
export const generatePassword = (): string => {
  return new RandExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).gen();
};

// Function which generates random e-mail which matches the regex
export const generateEmail = (): string => {
  return new RandExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).gen();
};

// E-amil validation function
const isEmailValid = (value: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(value);
};

// Password validation function
const isPasswordValid = (value: string): boolean => {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return passwordPattern.test(value);
};

// Validation functions for the User controller
export const registerValidation = ({
  username,
  email,
  password,
}: RegisterData): boolean => {
  if (
    !username ||
    !password ||
    !email ||
    !isEmailValid(email) ||
    !isPasswordValid(password)
  ) {
    return true;
  } else return false;
};

export const loginValidation = ({ username, password }: LoginData): boolean => {
  if (!username || !password) return true;
  else return false;
};
