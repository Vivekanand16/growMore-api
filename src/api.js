import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {
  userRouter,
  productRouter,
  notificationRouter,
  paymentRouter,
} from "./routes";
import { isAuthenticated } from "./controller";

dotenv.config();
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// validate if the user has valid session
app.all("*", isAuthenticated);

app.use("/.netlify/functions/api/user", userRouter);
app.use("/.netlify/functions/api/products", productRouter);
app.use("/.netlify/functions/api/notify", notificationRouter);
app.use("/.netlify/functions/api/payment", paymentRouter);

// all errors will be handled in this middleware
// when next() is called with parameter, error handler will be called
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

const handler = serverless(app);
export { handler };
