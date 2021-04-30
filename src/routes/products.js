import express from "express";
import { getProducts } from "../controller";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/noauth", getProducts);

export default productRouter;
export { productRouter };
