import jwt from "jsonwebtoken";

export const createRefreshToken = (payload: any) => {
  const rfTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (rfTokenSecret) {
    return jwt.sign(payload, rfTokenSecret);
  }
};
