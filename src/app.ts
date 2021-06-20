import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index";
import mongoose from "mongoose";
import config from "./config";

const app = express();
const PORT = config.PORT || 3001;

// Server configuration
app.use(express.json());
app.use(router);
app.use(cookieParser());
app.use(cors());

// Connect to the database
mongoose
  .connect(config.MONGO_DATABASE_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(err => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Server has started running on port ${PORT}.`
  );
});

export default app;
