import express from "express";
import { getUsers } from "../controller";

const userRouter = express.Router();

userRouter.get("/", getUsers);

export default userRouter;
export { userRouter };
