import express from "express";
import {
  validatePostData,
  createUser,
  updateUser,
  getProfile,
  getSavedCards,
} from "../controller";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.get("/profile", getProfile);
userRouter.patch("/update", validatePostData, updateUser);
userRouter.get("/savedcards", getSavedCards);

export default userRouter;
export { userRouter };
