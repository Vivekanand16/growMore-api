import express from "express";
import { config, createPaymentIntent, webhooks } from "../controller";

const paymentRouter = express.Router();

paymentRouter.get("/config", config);
paymentRouter.get("/create", createPaymentIntent);
paymentRouter.post("/webhooks", webhooks);

export default paymentRouter;
export { paymentRouter };
