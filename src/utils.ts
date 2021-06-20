import crypto from "crypto";
import RandExp from "randexp";

export const isEmailValid = (value: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(value);
};

export const isPasswordValid = (value: string): boolean => {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return passwordPattern.test(value);
};

export const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString("hex");
};

export const generateUsername = (): string => {
  return crypto.randomBytes(10).toString("hex");
};

export const generatePassword = (): string => {
  return new RandExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).gen();
};

export const generateEmail = (): string => {
  return new RandExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).gen();
};
