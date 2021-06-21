import axios from "axios";
import { UserModel } from "../models/User.model";
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

// Invalid data
const invalidPassword: string = "12345";
const invalidEmail: string = "hdhsh@hdhd@";

// Combined data
const registerCredentials = {
  username: sampleUsername,
  password: samplePassword,
  email: sampleEmail,
};

export const userTests = () => {
  // Clear the database before the tests
  before(async () => {
    const removal = await UserModel.deleteMany({});
  });

  // Test the [POST] /register route
  describe("[POST] /register", () => {
    it("it should add a new user to the database [200]", async () => {
      const response = await chai
        .request(app)
        .post("/register")
        .send(registerCredentials);

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Successfully registered!");
    });

    it("it should return username/email is in use [400]", async () => {
      const response = await chai
        .request(app)
        .post("/register")
        .send(registerCredentials);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Username or E-mail is already in use");
    });

    it("it should return invalid input [400]", async () => {
      const response = await chai.request(app).post("/register").send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return email and password are invalid [400]", async () => {
      const response = await chai.request(app).post("/register").send({
        username: generateUsername(),
        password: invalidPassword,
        email: invalidEmail,
      });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid email [400]", async () => {
      const response = await chai.request(app).post("/register").send({
        username: generateUsername(),
        password: samplePassword,
        email: invalidEmail,
      });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid password [400]", async () => {
      const response = await chai.request(app).post("/register").send({
        username: generateUsername(),
        password: invalidPassword,
        email: sampleEmail,
      });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });
  });

  // Test the [POST] /login route
  describe("[POST] /login", () => {
    it("it should return successfully logged [200]", async () => {
      const response = await chai.request(app).post("/login").send({
        username: sampleUsername,
        password: samplePassword,
      });

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.keys(
        "username",
        "email",
        "profile_img",
        "accessToken"
      );
    });

    it("it should return invalid username/password [400]", async () => {
      const response = await chai.request(app).post("/login").send({
        username: "3434343",
        password: "3434343",
      });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have
        .property("message")
        .eql("Invalid username or password");
    });

    it("it should return invalid input (password expected) [400]", async () => {
      const response = await chai.request(app).post("/login").send({
        username: "3434343",
      });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid input (username expected) [400]", async () => {
      const response = await chai.request(app).post("/login").send({
        password: "3434343",
      });

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });

    it("it should return invalid input (username and password expected) [400]", async () => {
      const response = await chai.request(app).post("/login").send({});

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid input");
    });
  });

  // Test the [GET] /authentication route
  describe("[GET] /authentication", () => {
    it("it should return authorization true", async () => {
      const token = await getToken(sampleUsername, samplePassword);

      const response = await chai
        .request(app)
        .get("/authentication")
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.property("is_authorized").eql(true);
    });

    it("it should return unauthorized (invalid token) [400]", async () => {
      const response = await chai
        .request(app)
        .get("/authentication")
        .set("Authorization", `Bearer 12345`);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("is_authorized").eql(false);
    });

    it("it should return unauthorized (no token) [400]", async () => {
      const response = await chai
        .request(app)
        .get("/authentication")
        .set("Authorization", `Bearer `);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("is_authorized").eql(false);
    });
  });
};
