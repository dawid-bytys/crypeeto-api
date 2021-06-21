import { userTests } from "./user.test";
import { newsTests } from "./news.test";

// Combine all tests
describe("#USER CONTROLLER", () => {
  userTests();
});

describe("#NEWS CONTROLLER", () => {
  newsTests();
});
