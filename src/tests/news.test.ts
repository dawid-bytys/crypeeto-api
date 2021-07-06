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

// Token to perform the tests
let token: string;

export const newsTests = () => {
  // Clear the database before the tests and login to get the accessToken
  before(async () => {
    const removal = await UserModel.deleteMany({});
    const register = await axios.post("http://localhost:4000/register", {
      username: sampleUsername,
      password: samplePassword,
      email: sampleEmail,
    });
    token = await getToken(sampleUsername, samplePassword);
  });

  // Test the [GET] /news route
  describe("[GET] /news", () => {
    it("it should return news data [200]", async () => {
      const response = await chai
        .request(app)
        .get("/news")
        .query({
          topic: "Bitcoin",
        })
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.keys("status", "totalResults", "articles");
    });

    it("it should return invalid data (no any data) [400]", async () => {
      const response = await chai
        .request(app)
        .get("/news")
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid data");
    });

    it("it should return invalid data (no topic) [400]", async () => {
      const response = await chai
        .request(app)
        .get("/news")
        .query({
          dupa: ";D",
        })
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(400);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Invalid data");
    });

    it("it should return unauthorized [401]", async () => {
      const response = await chai
        .request(app)
        .get("/news")
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
