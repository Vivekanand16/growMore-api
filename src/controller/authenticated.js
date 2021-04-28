import { auth } from "../firebase";

const notAuthenticatedResponse = {
  status: 401,
  errorMessage: "Unauthorized",
};

export async function isAuthenticated(req, res) {
  const idToken = req.body.idToken;
  if (!idToken) {
    return res.status(401).send(notAuthenticatedResponse);
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken.toString());
    // if uid is present, then user has valid session
    if (decodedToken.uid) {
      return next();
    }
  } catch (err) {
    return res.status(401).send(notAuthenticatedResponse);
  }
}
