import { db } from "../firebase";
import stripe from "../stripe";
import { PaymentError, InternalServerError } from "../errors";

const usersDB = db.collection("users");

export function config(req, res, next) {
  try {
    res.status(200).json({
      status: 200,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    return next(new InternalServerError(err.message));
  }
}

export async function createPaymentIntent(req, res, next) {
  try {
    // amount is specified in minimum currency value(paisa for inr)
    // Rs 1 = 100 paisa
    const { uid } = res.locals;
    const user = await usersDB.doc(uid).get();
    const { stripeCustomerId } = user.data();
    const amount = 100 * 100; // Rs.100
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      customer: stripeCustomerId || "",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      status: 200,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    return next(new PaymentError(err.message));
  }
}

export async function webhooks(req, res, next) {
  console.log("=============WEBHOOK CALLED=============");
}
