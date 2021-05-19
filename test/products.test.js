const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const should = chai.should();
const API_DOMAIN = "http://localhost:9000";
const FUNCTION_BASE_PATH = "/.netlify/functions/api";

describe("Products", () => {
  describe("GET /products", () => {
    it("without session - authentication error(401)", (done) => {
      chai
        .request(API_DOMAIN)
        .get(`${FUNCTION_BASE_PATH}/products`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.name.should.be.equal("NotAuthorizedError");
          done();
        });
    });

    it("with session - get all products", (done) => {
      chai
        .request(API_DOMAIN)
        .get(`${FUNCTION_BASE_PATH}/products`)
        .set("Authorization", `Bearer ${global.idToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("products");
          res.body.products.should.be.a("array");
          done(err);
        });
    });
  });
});
