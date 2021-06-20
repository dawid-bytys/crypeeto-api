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

// Sample data
const sampleUsername = generateUsername();
const samplePassword = generatePassword();
const sampleEmail = generateEmail();

// Get an accessToken
const getToken = async (): Promise<string> => {
  const { status, data } = await axios.post<{ accessToken: string }>(
    "http://localhost:3001/login",
    {
      username: sampleUsername,
      password: samplePassword,
    }
  );

  if (status === 400) return "error";

  return data.accessToken;
};

export const newsTests = () => {
  // Clear the database before the tests and login to get the accessToken
  before(async () => {
    const removal = await UserModel.deleteMany({});
    const register = await axios.post("http://localhost:3001/register", {
      username: sampleUsername,
      password: samplePassword,
      email: sampleEmail,
    });
  });

  // Test the [GET] /news route
  describe("[GET] /news", () => {
    it("it should return news data [200]", async () => {
      const token = await getToken();

      const response = await chai
        .request(app)
        .get("/news")
        .set("Authorization", `Bearer ${token}`);

      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.keys("status", "totalResults", "articles");
    });

    it("it should return access forbidden [403]", async () => {
      const response = await chai
        .request(app)
        .get("/news")
        .set("Authorization", `Bearer 12345`);

      response.should.have.status(403);
      response.body.should.be.a("object");
      response.body.should.have.property("message").eql("Access forbidden");
    });
  });
};
