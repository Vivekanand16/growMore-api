import stripe from "../stripe";
import { PaymentError, InternalServerError } from "../errors";

export function config(req, res, next) {
  try {
    res.status(200).json({
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
    const amount = 100 * 100; // Rs.100
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      customer: user.stripeCustomerId || "",
      payment_method_types: ["card"],
      confirm: true,
    });

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
    });
  } catch (err) {
    return next(new PaymentError(err.message));
  }
}

export async function webhooks(req, res, next) {
  res.status(200).json({
    msg: "webhook called",
  });
}
