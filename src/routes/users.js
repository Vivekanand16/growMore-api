import express from "express";
import {
  validatePostData,
  createUser,
  updateUser,
  getProfile,
} from "../controller";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.get("/profile", getProfile);
userRouter.patch("/update", validatePostData, updateUser);

export default userRouter;
export { userRouter };
