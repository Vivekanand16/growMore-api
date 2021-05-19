const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const should = chai.should();
const API_DOMAIN = "http://localhost:9000";
const FUNCTION_BASE_PATH = "/.netlify/functions/api";

describe("User", () => {
  describe("POST /user/create", () => {
    it("without session - authentication error(401)", (done) => {
      chai
        .request(API_DOMAIN)
        .post(`${FUNCTION_BASE_PATH}/user/create`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.name.should.be.equal("NotAuthorizedError");
          done();
        });
    });

    it("with session - create user successfully", (done) => {
      chai
        .request(API_DOMAIN)
        .post(`${FUNCTION_BASE_PATH}/user/create`)
        .set("Authorization", `Bearer ${global.idToken}`)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe("PATCH /user/update", () => {
    it("without session - authentication error(401)", (done) => {
      chai
        .request(API_DOMAIN)
        .patch(`${FUNCTION_BASE_PATH}/user/update`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.name.should.be.equal("NotAuthorizedError");
          done();
        });
    });

    it("without valid post data - bad request(400)", (done) => {
      chai
        .request(API_DOMAIN)
        .patch(`${FUNCTION_BASE_PATH}/user/update`)
        .set("Authorization", `Bearer ${global.idToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.name.should.be.equal("BadRequestError");
          done();
        });
    });

    it("with session and post data - update user name", (done) => {
      chai
        .request(API_DOMAIN)
        .patch(`${FUNCTION_BASE_PATH}/user/update`)
        .set("Authorization", `Bearer ${global.idToken}`)
        .send({
          userName: "Test User",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("GET /user/profile", () => {
    it("without session - authentication error(401)", (done) => {
      chai
        .request(API_DOMAIN)
        .get(`${FUNCTION_BASE_PATH}/user/profile`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.name.should.be.equal("NotAuthorizedError");
          done();
        });
    });

    it("with session - get profile details", (done) => {
      chai
        .request(API_DOMAIN)
        .get(`${FUNCTION_BASE_PATH}/user/profile`)
        .set("Authorization", `Bearer ${global.idToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.userName.should.be.equal("Test User");
          res.body.data.isSubscribed.should.be.false;
          done();
        });
    });
  });
});
