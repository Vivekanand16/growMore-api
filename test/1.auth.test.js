// named as 1.auth.test.js, as mocha runs test in alphabetical order
// session needs to created to test all apis
// idToken is set as global variable and used in all other tests
const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();

describe("Create google auth session", () => {
  it("set idToken", (done) => {
    chai
      .request("https://www.googleapis.com")
      .post(
        "/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDZk9eCWyodZI9WLMY89lA0RtO_c7biAkk"
      )
      .send({
        email: "test@test.com",
        password: "Test123",
        returnSecureToken: true,
      })
      .set("Content-Type", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("idToken");
        global.idToken = res.body.idToken;
        done();
      });
  });
});
