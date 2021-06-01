import stripePayment from "stripe";

const stripe = stripePayment(process.env.STRIPE_SECRET_KEY);
export default stripe;
