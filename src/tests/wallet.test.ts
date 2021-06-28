import axios from "axios";
import { UserModel } from "../Models/User.model";
import { WalletModel } from "../Models/Wallet.model";
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

export const walletTests = () => {
  // Clear the database before the tests and login to get the accessToken
  before(async () => {
    const removal = await UserModel.deleteMany({});
    const register = await axios.post("http://localhost:3001/register", {
      username: sampleUsername,
      password: samplePassword,
      email: sampleEmail,
    });
  });

  // Test the [POST] /wallet/create route
  describe("[POST] /wallet/create", () => {
    it("it should add a new wallet to the database (Bitcoin) [200]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: "Bitcoin" });

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Your wallet has been successfully created");
    });

    it("it should add a new wallet to the database (Ethereum) [200]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: "Ethereum" });

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Your wallet has been successfully created");
    });

    it("it should return invalid input (no currency provided) [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ dupa: ":D" });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid input (no any data provided) [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/create")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid input (invalid currency provided) [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: ":D" });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should the user already has a wallet with provided currency [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: "Bitcoin" });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("You already have a wallet with provided cryptocurrency");
    });
  });

  describe("[POST] /wallet/update/:type", () => {
    it("it should update the existing wallet :add [200]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/update/add")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: "Bitcoin", amount: 8000 });

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Your wallet has been successfully updated");
    });

    it("it should return invalid input (no any data) :add [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/update/add")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should update the existing wallet :exchange [200]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Bitcoin",
          currency_to: "Ethereum",
          currency_from_abbr: "BTC",
          currency_to_abbr: "ETH",
          amount: 8000,
        });

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Your wallet has been successfully updated");
    });

    it("it should return invalid input (no any data) :exchange [400]", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });
  });

  // Clear the database after the tests
  after(async () => {
    const userRemoval = await UserModel.deleteMany({});
    const walletRemoval = await WalletModel.deleteMany({});
  });
};
