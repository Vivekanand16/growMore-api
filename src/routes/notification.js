import express from "express";
import {
  isAdmin,
  validateNotifyPostData,
  notifyAll,
  notifySubscribers,
  notifyNonSubscribers,
} from "../controller";

const notificationRouter = express.Router();

// validate if the user has admin privileges
notificationRouter.all("*", isAdmin, validateNotifyPostData);

notificationRouter.post("/", notifyAll);
notificationRouter.post("/all", notifyAll);
notificationRouter.post("/subscribers", notifySubscribers);
notificationRouter.post("/nonsubscribers", notifyNonSubscribers);

export default notificationRouter;
export { notificationRouter };
