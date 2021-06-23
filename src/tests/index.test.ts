import { userTests } from "./user.test";
import { newsTests } from "./news.test";
import { cryptoTests } from "./crypto.test";
import { walletTests } from "./wallet.test";

// Combine all tests
describe("#USER CONTROLLER", () => {
  userTests();
});

describe("#NEWS CONTROLLER", () => {
  newsTests();
});

describe("#CRYPTO CONTROLLER", () => {
  cryptoTests();
});

describe("#WALLET CONTROLLER", () => {
  walletTests();
});
