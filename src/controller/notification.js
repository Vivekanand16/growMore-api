import { Expo } from "expo-server-sdk";
import { db } from "../firebase";

const expo = new Expo();
const usersDB = db.collection("users");

export function validateNotifyPostData(req, res, next) {
  const { title, body } = req.body;
  if (!title && !body) {
    return res.status(400).json({
      status: 400,
      errorCode: "bad-request",
      errorMessage: "Please make call with valid post data.",
    });
  }
  next();
}

function constructMessage(responseBody = {}, tokenIDs = []) {
  const { title, body, sound = "default", data = {} } = responseBody;
  const messages = [];
  const messageInfo = {
    sound,
    title,
    body,
    data,
  };
  tokenIDs.forEach((token) => {
    messages.push({
      to: token,
      ...messageInfo,
    });
  });

  return messages;
}

// https://github.com/expo/expo-server-sdk-node
async function sendNotification(messages) {
  const chunks = expo.chunkPushNotifications(messages);
  // array to check status of the notification
  const tickets = [];
  let errorMessage = "";

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (err) {
      errorMessage = err.message;
      console.log("Error while sending notifications", error);
      console.log("Error notification ticket ids", JSON.stringify(tickets));
    }
  }
  return errorMessage;
}

export async function notifyAll(req, res) {
  const response = await usersDB.get();
  const allUsers = response.docs.map((doc) => doc.data().deviceToken);
  const messages = constructMessage(req.body, allUsers);
  await sendNotification(messages);

  res.status(200).json({
    status: 200,
    msg: "Notification sent to all users.",
  });
}

export async function notifySubscribers(req, res) {
  const response = await usersDB.where("isSubscribed", "==", true).get();
  const subscribedUsers = response.docs.map((doc) => doc.data().deviceToken);
  const messages = constructMessage(req.body, subscribedUsers);
  await sendNotification(messages);

  res.status(200).json({
    status: 200,
    msg: "Notification sent to subscribers.",
  });
}

export async function notifyNonSubscribers(req, res) {
  const response = await usersDB.where("isSubscribed", "==", false).get();
  const nonSubscribedUsers = response.docs.map((doc) => doc.data().deviceToken);
  const messages = constructMessage(req.body, nonSubscribedUsers);
  await sendNotification(messages);

  res.status(200).json({
    status: 200,
    msg: "Notification sent to non subscribers.",
  });
}
