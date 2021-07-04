import crypto from "crypto";
import RandExp from "randexp";
import axios from "axios";

// Types
interface LoginData {
  username: string | undefined;
  password: string | undefined;
}

interface RegisterData extends LoginData {
  email: string | undefined;
}

interface Wallet {
  currency: string;
  currency_from: string;
  currency_to: string;
  currency_from_abbr: string;
  currency_to_abbr: string;
  amount: number;
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
export const isEmailValid = (value: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(value);
};

// Password validation function
export const isPasswordValid = (value: string): boolean => {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return passwordPattern.test(value);
};

// Wallet data validation
export const isDataValid = (data: Wallet): boolean => {
  return (
    !data.currency_from ||
    !data.currency_to ||
    !data.currency_from_abbr ||
    !data.currency_to_abbr ||
    !data.amount
  );
};

// Get an accessToken
export const getToken = async (
  username: string,
  password: string
): Promise<string> => {
  const { status, data } = await axios.post<{ accessToken: string }>(
    "http://localhost:3001/login",
    {
      username: username,
      password: password,
    }
  );

  if (status === 400) return "error";

  return data.accessToken;
};
