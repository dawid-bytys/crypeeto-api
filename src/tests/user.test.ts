import axios from "axios";
import { UserModel } from "../models/User.model";
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

// Clear the database before the tests
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
};

// Test the [POST] /register route
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
          .eql("Successfully registered!");
        done();
      });
  });

  it("it should return the username/email is in use [400]", done => {
    chai
      .request(app)
      .post("/register")
      .send(registerCredentials)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Username or E-mail is already in use");
        done();
      });
  });

  it("it should return invalid input [400]", done => {
    chai
      .request(app)
      .post("/register")
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });

  it("it should return the email and password are invalid [400]", done => {
    chai
      .request(app)
      .post("/register")
      .send({
        username: generateUsername(),
        password: invalidPassword,
        email: invalidEmail,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });

  it("it should return the email is invalid [400]", done => {
    chai
      .request(app)
      .post("/register")
      .send({
        username: generateUsername(),
        password: samplePassword,
        email: invalidEmail,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });

  it("it should return the password is invalid [400]", done => {
    chai
      .request(app)
      .post("/register")
      .send({
        username: generateUsername(),
        password: invalidPassword,
        email: sampleEmail,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });
});

// Test the [POST] /login route
describe("[POST] /login", () => {
  it("should receive the message that successfully logged [200]", done => {
    chai
      .request(app)
      .post("/login")
      .send({
        username: sampleUsername,
        password: samplePassword,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.keys(
          "username",
          "email",
          "profile_img",
          "accessToken"
        );
        done();
      });
  });

  it("should receive the message that invalid username/password [400]", done => {
    chai
      .request(app)
      .post("/login")
      .send({
        username: "3434343",
        password: "3434343",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Invalid username or password");
        done();
      });
  });

  it("should receive the message that invalid input (password expected) [400]", done => {
    chai
      .request(app)
      .post("/login")
      .send({
        username: "3434343",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });

  it("should receive the message that invalid input (username expected) [400]", done => {
    chai
      .request(app)
      .post("/login")
      .send({
        password: "3434343",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });
  it("should receive the message that invalid input (username and password expected) [400]", done => {
    chai
      .request(app)
      .post("/login")
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid input");
        done();
      });
  });
});

// Get accessToken
const getToken = async (): Promise<string> => {
  try {
    const response = await axios.post("/login", {
      username: sampleUsername,
      password: samplePassword,
    });

    return response.data.accessToken;
  } catch (err) {
    return err.response.data;
  }
};

// Test the [GET] /authentication route
describe("[GET] /authentication", () => {
  getToken().then(data => {
    it("should receive user data", done => {
      chai
        .request(app)
        .get("/authentication")
        .set("Authorization", `Bearer ${data}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("accessToken").eql("sraka");
          done();
        });
    });
  });
});
