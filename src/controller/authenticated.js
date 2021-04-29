import { auth } from "../firebase";

const notAuthenticatedResponse = {
  status: 401,
  errorMessage: "Unauthorized",
};

export async function isAuthenticated(req, res, next) {
  const { authorization = "" } = req.headers;
  const bearerSplit = authorization.split("Bearer ");

  if (
    !authorization ||
    !authorization.startsWith("Bearer") ||
    bearerSplit.length !== 2
  ) {
    return res.status(401).send(notAuthenticatedResponse);
  }

  const idToken = bearerSplit[1];
  if (!idToken) {
    return res.status(401).send(notAuthenticatedResponse);
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken.toString());
    // if uid is present, then user has valid session
    if (decodedToken.uid) {
      res.locals.uid = decodedToken.uid;
      next();
    }
  } catch (err) {
    return res.status(401).send(notAuthenticatedResponse);
  }
}
