import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/User.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getPublishedImages } from "../controllers/message.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUser);
userRouter.get("/published-images", getPublishedImages);

export default userRouter;
