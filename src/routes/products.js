import express from "express";
import { isAuthenticated, getProducts } from "../controller";

const productRouter = express.Router();

productRouter.get("/", isAuthenticated, getProducts);
productRouter.get("/noauth", getProducts);

export default productRouter;
export { productRouter };
