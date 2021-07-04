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

// Token to perform the tests
let token: string;

export const walletTests = () => {
  // Clear the database before the tests, register and login to get an accessToken
  before(async () => {
    const removal = await UserModel.deleteMany({});
    const register = await axios.post("http://localhost:4000/register", {
      username: sampleUsername,
      password: samplePassword,
      email: sampleEmail,
    });
    token = await getToken(sampleUsername, samplePassword);
  });

  // Test the [POST] /wallet/create route
  describe("[POST] /wallet/create", () => {
    it("it should add a new wallet to the database (Bitcoin) [200]", async () => {
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
      const response = await chai
        .request(app)
        .post("/wallet/update/add")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid currency :add [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/add")
        .set("Authorization", `Bearer ${token}`)
        .send({ currency: "Euro" });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid currency");
    });

    it("it should update the existing wallet :exchange [200]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Bitcoin",
          currency_to: "Ethereum",
          amount: 8000,
        });

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Your wallet has been successfully updated");
    });

    it("it should return invalid input (no any data) :exchange [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid currency (currency_from) :exchange [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Euro",
          currency_to: "Ethereum",
          amount: 10000,
        });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid currency");
    });

    it("it should return invalid currency (currency_to) :exchange [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Ethereum",
          currency_to: "Euro",
          amount: 10000,
        });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid currency");
    });

    it("it should return insufficient funds :exchange [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Ethereum",
          currency_to: "Bitcoin",
          amount: 10000000,
        });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Insufficient funds in your account");
    });

    it("it should return wallet couldn't be found (currency_from) :exchange [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Tether",
          currency_to: "Bitcoin",
          amount: 10000000,
        });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Wallet couldn't be found");
    });

    it("it should return wallet couldn't be found (currency_to) :exchange [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/exchange")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currency_from: "Bitcoin",
          currency_to: "Ripple",
          amount: 10000000,
        });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Wallet couldn't be found");
    });

    it("it should return invalid endpoint :whatever [400]", async () => {
      const response = await chai
        .request(app)
        .post("/wallet/update/whatever")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      response.should.have.status(404);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid endpoint");
    });
  });

  // Clear the database after the tests
  after(async () => {
    const userRemoval = await UserModel.deleteMany({});
    const walletRemoval = await WalletModel.deleteMany({});
  });
};
