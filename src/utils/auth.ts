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
  if (!accessToken) return res.status(401).send({ message: "Unauthorized" });

  // Try to verify the accessToken with the TOKEN_SECRET
  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_TOKEN_SECRET || ""
    );

    // Assign the token to the variable
    req.user = decodedToken;

    // Continue doing the request
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
};
