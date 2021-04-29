import express from "express";
import {
  isAuthenticated,
  validatePostData,
  createUser,
  updateUser,
  getProfile,
} from "../controller";

const userRouter = express.Router();

userRouter.post("/create", isAuthenticated, createUser);
userRouter.get("/profile", isAuthenticated, getProfile);
userRouter.patch("/update", isAuthenticated, validatePostData, updateUser);

export default userRouter;
export { userRouter };
