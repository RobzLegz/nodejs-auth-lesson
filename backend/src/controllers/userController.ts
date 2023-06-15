import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { createRefreshToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";

export const userCtrl = {
  register: async (req: Request, res: Response) => {
    const {
      email,
      username,
      password,
    }: { email: string; username: string; password: string } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ err: "Password is too short" });
    }

    const emailTest = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (emailTest) {
      return res.status(400).json({ err: "Email already in use" });
    }

    const usernameTest = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (usernameTest) {
      return res.status(400).json({ err: "Username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: passwordHash,
      },
    });

    const refreshToken = createRefreshToken({ id: user.id });

    res.cookie("token", refreshToken, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ msg: "Registered", user });
  },
  login: async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } =
      req.body;

    if (password.length < 6) {
      return res.status(400).json({ err: "Password is too short" });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ err: "User with this username was not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ err: "Incorrect password" });
    }

    const refreshToken = createRefreshToken({ id: user.id });

    res.cookie("token", refreshToken, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ msg: "Logged in", user });
  },
  getUserInfo: async (req: Request, res: Response) => {
    const token = req.headers.cookie?.replace("token=", "");
    if (!token) {
      return res.status(400).json({ err: "Invalid authorization" });
    }

    const rfTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!rfTokenSecret) {
      return res.status(500).json({ err: "Something went wrong :(" });
    }

    const decoded: any = jwt.verify(token, rfTokenSecret);
    if (!decoded || !decoded.id) {
      return res.status(400).json({ err: "Invalid authorization" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    res.json({ msg: "ok", user });
  },
  getUsers: async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    res.json({ msg: "Heres a list of users", users });
  },
};
