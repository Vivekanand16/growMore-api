import { db } from "../firebase";
import stripe from "../stripe";
import { BadRequestError, NotFoundError, InternalServerError } from "../errors";

const usersDB = db.collection("users");

export function validatePostData(req, res, next) {
  const { userName, deviceToken, ...restPostData } = req.body;
  const malformedData = Object.entries(restPostData).length > 0;

  // if both username and deviceToken is not passed
  // if any other fields are passed
  // consider as bad request
  if ((!userName && !deviceToken) || malformedData) {
    return next(new BadRequestError());
  }
  next();
}

/*
  First create a customer on stripe, so that the customer card details can be saved.
  Then the "id" from create customers call is stored in "stripeCustomerId" field on the db.
*/
export async function createUser(req, res, next) {
  try {
    const { uid } = res.locals;
    const customer = await stripe.customers.create();
    await usersDB.doc(uid).set({
      userName: "",
      deviceToken: "",
      isSubscribed: false,
      stripeCustomerId: customer.id,
      createdAt: Date.now(),
    });
  } catch (err) {
    return next(new InternalServerError(err.message));
  }

  res.status(201).json({
    status: 201,
    message: "User created successfully.",
  });
}

export async function updateUser(req, res, next) {
  try {
    const { uid } = res.locals;
    const postData = req.body;
    await usersDB.doc(uid).update({
      ...postData,
    });
  } catch (err) {
    return next(new InternalServerError(err.message));
  }

  res.status(200).json({
    status: 200,
    message: "User updated successfully.",
  });
}

export async function getProfile(req, res, next) {
  const data = {};

  try {
    const { uid } = res.locals;
    const user = await usersDB.doc(uid).get();

    if (!user.exists) {
      return next(new NotFoundError("User not found."));
    } else {
      const { userName, isSubscribed } = user.data();
      data.userName = userName;
      data.isSubscribed = isSubscribed;
    }
  } catch (err) {
    return next(new InternalServerError(err.message));
  }

  res.status(200).json({
    status: 200,
    data,
  });
}

export async function getSavedCards(req, res, next) {
  const cardsInfo = [];
  try {
    const { uid } = res.locals;
    const user = await usersDB.doc(uid).get();
    if (!user.exists) {
      return next(new NotFoundError("User not found."));
    }

    const { stripeCustomerId } = user.data();
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
      limit: 5,
    });
    if (!paymentMethods.data.length) {
      return next(new NotFoundError("No cards found."));
    }
    //filtering response fields
    const { data = [], has_more } = paymentMethods;
    data.forEach((paymentMethod) => {
      const { id, card = {} } = paymentMethod;
      const { brand, exp_month, exp_year, last4 } = card;
      cardsInfo.push({
        id,
        brand,
        exp_month,
        exp_year,
        last4,
      });
    });

    res.status(200).json({
      status: 200,
      cards: cardsInfo,
      hasMore: has_more,
    });
  } catch (err) {
    return next(new InternalServerError(err.message));
  }
}
