import express from "express";
import router from "./Routes/index";
import config from "./config";

const app = express();
const PORT = config.PORT || 3001;

// Server configuration
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Server has started running on port ${PORT}.`
  );
});
