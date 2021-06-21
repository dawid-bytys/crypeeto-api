import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Authentication function for protected routes
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  // Check whether the accessToken exists
  if (!accessToken)
    return res.status(403).send({ message: "Access forbidden" });

  // Try to verify the accessToken with the TOKEN_SECRET
  try {
    jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET || "");

    // Continue doing the request
    next();
  } catch (err) {
    res.status(403).send({ message: "Access forbidden" });
  }
};
