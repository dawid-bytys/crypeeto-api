import mongoose from "mongoose";
import { UserModel } from "../Models/User.model";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import config from "../config";
import { generateEmail, generatePassword, generateUsername } from "../utils";

chai.should();
chai.use(chaiHttp);

// Connect to the database
mongoose
  .connect(config.MONGO_DATABASE_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(err => {
    console.log(err);
  });

// Clear the database before tests
before(done => {
  UserModel.deleteMany({}, err => {
    if (err) console.log(err);
  });
  done();
});

const sampleUsername = generateUsername();
const samplePassword = generatePassword();
const sampleEmail = generateEmail();

const invalidPassword: string = "12345";
const invalidEmail: string = "hdhsh@hdhd@";

const registerCredentials = {
  username: sampleUsername,
  password: samplePassword,
  email: sampleEmail,
  profile_img: "",
};

// Test the [POST] /  register route
describe("[POST] /register", () => {
  it("it should add a new user to the database [200]", done => {
    chai
      .request(app)
      .post("/register")
      .send(registerCredentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Successfully registered.");
        done();
      });
  });

  it("it should return the username/email is in use [401]", done => {
    chai
      .request(app)
      .post("/register")
      .send(registerCredentials)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Username/e-mail is already in use.");
        done();
      });
  });

  it("it should return invalid input [401]", done => {
    chai
      .request(app)
      .post("/register")
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input.");
        done();
      });
  });

  it("it should return the email and password are invalid [401]", done => {
    chai
      .request(app)
      .post("/register")
      .send({
        username: generateUsername(),
        password: invalidPassword,
        email: invalidEmail,
        profile_img: "",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input.");
        done();
      });
  });

  it("it should return the email is invalid [401]", done => {
    chai
      .request(app)
      .post("/register")
      .send({
        username: generateUsername(),
        password: samplePassword,
        email: invalidEmail,
        profile_img: "",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input.");
        done();
      });
  });

  it("it should return the password is invalid [401]", done => {
    chai
      .request(app)
      .post("/register")
      .send({
        username: generateUsername(),
        password: invalidPassword,
        email: sampleEmail,
        profile_img: "",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input.");
        done();
      });
  });
});
