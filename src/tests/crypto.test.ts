import axios from "axios";
import { UserModel } from "../Models/User.model";
import { getToken } from "../utils/utils";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import {
  generateEmail,
  generatePassword,
  generateUsername,
} from "../utils/utils";

chai.should();
chai.use(chaiHttp);

// Sample data
const sampleUsername = generateUsername();
const samplePassword = generatePassword();
const sampleEmail = generateEmail();

export const cryptoTests = () => {
  // Clear the database before the tests and login to get the accessToken
  before(async () => {
    const removal = await UserModel.deleteMany({});
    const register = await axios.post("http://localhost:3001/register", {
      username: sampleUsername,
      password: samplePassword,
      email: sampleEmail,
    });
  });

  // Test the [GET] /time_series route
  describe("[GET] /time_series", () => {
    it("it should return crypto latest prices [200]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .get("/time_series")
        .query({
          symbol: "BTC/USD",
          exchange: "Binance",
          interval: "1h",
        })
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.keys("meta", "values", "status");
    });

    it("it should return invalid data (no any data) [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .get("/time_series")
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid data");
    });

    it("it should return invalid data (no symbol) [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .get("/time_series")
        .query({
          exchange: "Binance",
          interval: "1h",
        })
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid data");
    });

    it("it should return unauthorized [401]", async () => {
      const response = await chai
        .request(app)
        .get("/time_series")
        .set("Authorization", `Bearer 12345`);

      response.should.have.status(401);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Unauthorized");
    });
  });

  // [GET] /price
  describe("[GET] /price", () => {
    it("it should return converted price [200]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .get("/price")
        .query({
          symbol: "BTC/USD",
          exchange: "Binance",
        })
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.property("price");
    });

    it("it should return unauthorized [401]", async () => {
      const response = await chai
        .request(app)
        .get("/price")
        .query({
          symbol: "BTC/USD",
          exchange: "Binance",
        })
        .set("Authorization", `Bearer 12345`);

      response.should.have.status(401);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Unauthorized");
    });
  });

  // Clear the database after the tests
  after(async () => {
    const removal = await UserModel.deleteMany({});
  });
};
