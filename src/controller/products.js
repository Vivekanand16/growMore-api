import { db } from "../firebase";

const productsDB = db.collection("products");

export async function getProducts(req, res) {
  let status = 200;
  let errorCode = "";
  let errorMessage = "";
  let productResponse = [];

  try {
    const response = await productsDB.get();
    response.docs.forEach((doc) => productResponse.push(doc.data()));

    if (!productResponse.length) {
      status = 404;
      errorCode = "not-found";
      errorMessage = "No products found.";
    }
  } catch (err) {
    status = 500;
    errorCode = err.errorCode;
    errorMessage = err.message;
  }

  res.status(status);
  res.json({
    status,
    errorCode,
    errorMessage,
    products: productResponse,
  });
}
