import { Request, Response } from "express";
import {
  TypedRequestBody,
  TypedResponse,
  RegisterBody,
  LoginBody,
} from "../utils/types";
import { userModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";

class UserController {
  static userRegistration = async (
    req: TypedRequestBody<RegisterBody>,
    res: TypedResponse<ApiResponse<any>>
  ): Promise<Response> => {
    const { fullname, email, password, phoneNumber } = req.body;

    if (!fullname || !email || !password || !phoneNumber) {
      throw new ApiError(400, "Please fill all the fields");
    }

    const existedUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or phone number already exists");
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign(
        { userID: newUser._id },
        process.env.JWT_SECRET_KEY ||
          "pOpXsyY9GHlN8j92fHPy9rH9+IHN+71mUu2U99P5WfT",
        { expiresIn: "5d" }
      );

      // Set token in HttpOnly cookie
      const cookieOptions: CookieOptions = {
        httpOnly: true, // Mitigates XSS attacks
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      };
      res.cookie("token", token, cookieOptions);

      // Return success response with only the required user details
      const responseData = {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      };

      return res
        .status(201)
        .json(
          new ApiResponse(201, responseData, "User registered successfully")
        );
    } catch (error) {
      console.error(error);
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }
  };

  static userLogin = async (
    req: TypedRequestBody<LoginBody>,
    res: TypedResponse<ApiResponse<any>>
  ): Promise<Response> => {
    const { email, password } = req.body;
    if (!email || !password) {
      console.error("Missing email or password in login request");
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email and password are required"));
    }

    try {
      const existedUser = await userModel.findOne({ email });
      if (!existedUser) {
        console.error("User not found for email:", email);
        throw new ApiError(404, "User not found");
      }

      const isMatch = await bcrypt.compare(password, existedUser.password);

      if (isMatch) {
        // Generate JWT
        const token = jwt.sign(
          { userID: existedUser._id },
          process.env.JWT_SECRET_KEY ||
            "pOpXsyY9GHlN8j92fHPy9rH9+IHN+71mUu2U99P5WfT",
          { expiresIn: "5d" }
        );

        // Set token in HttpOnly cookie
        const cookieOptions: CookieOptions = {
          httpOnly: true, // Mitigates XSS attacks
          secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
          // sameSite: "strict", // Protects against CSRF attacks
          maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        };
        res.cookie("token", token, cookieOptions);

        // Return success response with only the required user details
        const responseData = {
          _id: existedUser._id,
          fullname: existedUser.fullname,
          email: existedUser.email,
          phoneNumber: existedUser.phoneNumber,
        };

        return res
          .status(200)
          .json(
            new ApiResponse(200, responseData, "User logged in successfully")
          );
      } else {
        console.error("Incorrect password for user:", email);
        return res
          .status(401)
          .json(new ApiResponse(401, null, "Invalid email or password"));
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res
        .status(500)
        .json(new ApiResponse(500, null, "An error occurred during login"));
    }
  };

  static logout = (req: Request, res: Response): Response => {
    // Clear the token cookie
    res.clearCookie("token");
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  };
}

export default UserController;
