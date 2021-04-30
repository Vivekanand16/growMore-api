import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { userRouter, productRouter, notificationRouter } from "./routes";
import { isAuthenticated } from "./controller";

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// validate if the user has valid session
app.all("*", isAuthenticated);

app.use("/.netlify/functions/api/user", userRouter);
app.use("/.netlify/functions/api/products", productRouter);
app.use("/.netlify/functions/api/notify", notificationRouter);

const handler = serverless(app);
export { handler };
