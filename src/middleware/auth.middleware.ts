import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { TypedRequestBody, TypedResponse } from "../utils/types";

interface VerifyUser {
  token: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

interface DecodedToken {
  userID: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const checkUserAuth = async (
  req: TypedRequestBody<VerifyUser>,
  res: TypedResponse<ApiResponse<any>>,
  next: NextFunction
): Promise<Response | void> => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get Token from header
      token = authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY ||
          "pOpXsyY9GHlN8j92fHPy9rH9+IHN+71mUu2U99P5WfT"
      ) as DecodedToken;

      // Get User from Token
      req.user = await userModel.findById(decoded.userID).select("-password");

      next();
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .send({ status: "failed", message: "Unauthorized User" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
};

export default checkUserAuth;
