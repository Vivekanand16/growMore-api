const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200);
  res.json({
    msg: "hello",
  });
});

router.get("/products", (req, res) => {
  res.status(200);
  res.json({
    msg: "products",
  });
});

app.use("/.netlify/functions/api", router);

module.exports = app;
module.exports.handler = serverless(app);
