import { db } from "../firebase";

const usersDB = db.collection("users");

export function validatePostData(req, res, next) {
  const userName = req.body.userName;

  if (!userName) {
    return res.status(400).json({
      status: 400,
      errorCode: "bad-request",
      errorMessage: "Please make call with valid post data.",
    });
  }
  next();
}

export async function createUser(req, res) {
  let status = 200;
  let errorCode = "";
  let errorMessage = "";

  try {
    const { uid } = res.locals;
    await usersDB.doc(uid).set({
      userName: "",
      isSubscribed: false,
    });
  } catch (err) {
    status = 500;
    errorCode = err.code;
    errorMessage = err.message;
  }

  res.status(status).json({
    status,
    errorCode,
    errorMessage,
  });
}

export async function updateUser(req, res) {
  let status = 200;
  let errorCode = "";
  let errorMessage = "";

  try {
    const { uid } = res.locals;
    const userName = req.body.userName;
    await usersDB.doc(uid).update({
      userName,
    });
  } catch (err) {
    status = 500;
    errorCode = err.code;
    errorMessage = err.message;
  }

  res.status(status).json({
    status,
    errorCode,
    errorMessage,
  });
}

export async function getProfile(req, res) {
  let status = 200;
  let errorCode = "";
  let errorMessage = "";
  const data = {};

  try {
    const { uid } = res.locals;
    const response = await usersDB.doc(uid).get();

    if (!response.exists) {
      status = 404;
      errorCode = "not-found";
      errorMessage = "User not found.";
    } else {
      const { userName, isSubscribed } = response.data();
      data.userName = userName;
      data.isSubscribed = isSubscribed;
    }
  } catch (err) {
    status = 500;
    errorCode = err.code;
    errorMessage = err.message;
  }

  res.status(status).json({
    status,
    errorCode,
    errorMessage,
    data,
  });
}
