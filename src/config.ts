import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname + "/.env") });

export default {
  PORT: process.env.PORT,
  TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY,
  CRYPTO_NEWS_API_KEY: process.env.CRYPTO_NEWS_API_KEY,
  MONGO_DATABASE_URI: process.env.MONGO_DATABASE_URI,
};
