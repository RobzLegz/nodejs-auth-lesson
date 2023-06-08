import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.cookies)
  const token = req.cookies?.token;
  if (!token) {
    return res.status(400).json({ err: "Invalid authorization" });
  }

  const rfTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!rfTokenSecret) {
    return res.status(500).json({ err: "Something went wrong :(" });
  }

  const decoded: any = jwt.verify(token, rfTokenSecret);
  console.log(decoded)
  if (!decoded || !decoded.id) {
    return res.status(400).json({ err: "Invalid authorization" });
  }

  const userCheck = await prisma.user.findFirst({ where: { id: decoded.id } });
  if (!userCheck || userCheck.role < 1) {
    return res.status(400).json({ err: "Invalid authorization" });
  }

  // req.user_id = decoded.id;
  next();
};
