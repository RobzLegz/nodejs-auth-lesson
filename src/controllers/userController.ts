import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

export const userCtrl = {
  register: async (req: Request, res: Response) => {
    const {
      email,
      username,
      password,
    }: { email: string; username: string; password: string } = req.body;

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

    res.json({ msg: "Registered", user });
  },
};
