import { auth, db } from "../firebase";

const usersDB = db.collection("users");

const nonSecurePaths = ["/.netlify/functions/api/products/noauth"];
const notAuthenticatedResponse = {
  status: 401,
  errorMessage: "Unauthorized",
};

const notAdminResponse = {
  status: 401,
  errorMessage: "You don't have privileges.",
};

function isValidAuthorizationHeader(authorization) {
  // Bearer <idToken>
  const bearerSplit = authorization.split("Bearer ");
  const idToken = bearerSplit[1];
  let isValidToken = true;

  if (
    !authorization ||
    !authorization.startsWith("Bearer") ||
    bearerSplit.length !== 2 ||
    !idToken
  ) {
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
    return res.status(401).json(notAuthenticatedResponse);
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken.toString());
    // if uid is present, then user has valid session
    if (decodedToken.uid) {
      res.locals.uid = decodedToken.uid;
      next();
    }
  } catch (err) {
    return res.status(401).json(notAuthenticatedResponse);
  }
}

export async function isAdmin(req, res, next) {
  const { uid } = res.locals;
  try {
    const response = await usersDB.doc(uid).get();
    const { isAdmin = false } = response.data();
    if (!response.exists || !isAdmin) {
      return res.status(401).json(notAdminResponse);
    }
    next();
  } catch (err) {
    return res.status(401).json(notAdminResponse);
  }
}
