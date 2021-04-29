import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { userRouter, productRouter } from "./routes";

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/.netlify/functions/api/user", userRouter);
app.use("/.netlify/functions/api/products", productRouter);

const handler = serverless(app);
export { handler };
