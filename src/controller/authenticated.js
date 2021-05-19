import { auth, db } from "../firebase";
import { NotAuthorizedError, NotAdminError } from "../errors";

const usersDB = db.collection("users");
const nonSecurePaths = [
  "/.netlify/functions/api/products/noauth",
  "/.netlify/functions/api/payment/webhooks",
];

function isValidAuthorizationHeader(authorization) {
  // Bearer <idToken>
  const bearerSplit = authorization.split("Bearer ");
  const idToken = bearerSplit[1];
  let isValidToken = true;

  if (!authorization.startsWith("Bearer") || !idToken) {
    isValidToken = false;
  }
  return { isValidToken, idToken };
}

export async function isAuthenticated(req, res, next) {
  if (nonSecurePaths.includes(req.path)) {
    return next();
  }
  const { authorization = "" } = req.headers;
  const { isValidToken, idToken } = isValidAuthorizationHeader(authorization);

  if (!isValidToken) {
    return next(new NotAuthorizedError());
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken.toString());
    // if uid is present, then user has valid session
    if (decodedToken.uid) {
      res.locals.uid = decodedToken.uid;
      next();
    }
  } catch (err) {
    return next(new NotAuthorizedError());
  }
}

export async function isAdmin(req, res, next) {
  const { uid } = res.locals;
  try {
    const response = await usersDB.doc(uid).get();
    const { isAdmin = false } = response.data();
    if (!response.exists || !isAdmin) {
      return next(new NotAdminError());
    }
    next();
  } catch (err) {
    return next(new NotAdminError());
  }
}
