// https://www.frankcalise.com/netlify-functions-and-firebase-sdk-gotchas
const nodeExternals = require("webpack-node-externals");

module.exports = {
  externals: [nodeExternals()],
};
