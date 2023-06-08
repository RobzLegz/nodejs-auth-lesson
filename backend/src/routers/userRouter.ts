import { userCtrl } from "../controllers/userController";
import express from "express";
import { authAdmin } from "../middleware/auth";

export const userRouter = express.Router();

userRouter.route("/register").post(userCtrl.register);
userRouter.route("/login").get(userCtrl.login);

userRouter.route("/list").get(authAdmin, userCtrl.getUsers);
