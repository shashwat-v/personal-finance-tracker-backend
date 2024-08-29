import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../models/user.model";

interface IUser {
  fullname: string;
  email: string;
  phoneNumber: string;
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new Error("JWT secret key is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    // console.log(decoded);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await userModel.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
