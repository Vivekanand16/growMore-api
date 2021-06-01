import { db } from "../firebase";
import { NotFoundError, InternalServerError } from "../errors";

const productsDB = db.collection("products");

export async function getProducts(req, res, next) {
  let productResponse = [];

  try {
    const response = await productsDB.get();
    response.docs.forEach((doc) => productResponse.push(doc.data()));

    if (!productResponse.length) {
      return next(new NotFoundError("No products found."));
    }
  } catch (err) {
    return next(new InternalServerError(err.message));
  }

  res.status(200).json({
    status: 200,
    products: productResponse,
  });
}
