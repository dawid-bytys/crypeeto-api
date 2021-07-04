import * as dotenv from "dotenv";
import path from "path";

// Configure the .env file
dotenv.config({ path: path.join(__dirname + "/.env") });

import express from "express";
import cors from "cors";
import router from "./Routes/index";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 4000;

// Server configuration
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(router);

// Try to connect to the database
try {
  mongoose.connect(process.env.MONGO_DATABASE_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Successfully connected to the database!");
} catch (err) {
  console.log(err);
}

app.listen(PORT, () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Server has started running on port ${PORT}.`
  );
});

export default app;
