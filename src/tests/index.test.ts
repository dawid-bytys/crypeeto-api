import { userTests } from "./user.test";
import { newsTests } from "./news.test";

describe("[USER CONTROLLER]", () => {
  userTests();
});

describe("[NEWS CONTROLLER]", () => {
  newsTests();
});
