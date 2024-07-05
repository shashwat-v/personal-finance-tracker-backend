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

class UserController {
  static userRegistration = async (
    req: TypedRequestBody<RegisterBody>,
    res: TypedResponse<ApiResponse<any>>
  ): Promise<Response> => {
    const { fullname, email, password, phoneNumber } = req.body;

    // Log the input for debugging purposes
    // console.log("Received input:", { fullname, email, password, phoneNumber });

    // Validate that all required fields are provided
    // if (!fullname || !email || !password || !phoneNumber) {
    //   throw new ApiError(400, "Please fill all the fields");
    // }

    // Check if the user already exists
    const existedUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or phone number already exists");
    }

    // Check if all required fields are provided
    // if (!fullname || !email || !password || !phoneNumber) {
    //   throw new ApiError(400, "Please fill all the fields");
    // }

    try {
      // Hash the password
      if (!password) {
        console.error("Password is undefined");
        throw new ApiError(400, "Password is required");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the new user
      const newUser = new userModel({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword, // Save the hashed password
      });

      // Save the user to the database
      await newUser.save();
      //generate jwt
      const token = jwt.sign(
        { userID: newUser._id },
        process.env.JWT_SECRET_KEY ||
          "pOpXsyY9GHlN8j92fHPy9rH9+IHN+71mUu2U99P5WfT",
        { expiresIn: "5d" }
      );
      newUser.token = token;
      await newUser.save();
      // Return success response
      return res
        .status(201)
        .json(new ApiResponse(201, newUser, "User registered successfully"));
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

    // Log the received input for debugging
    console.log("Login request body:", { email, password });

    // Check if both email and password are provided
    if (!email || !password) {
      // Log missing fields and return error response
      console.error("Missing email or password in login request");
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email and password are required"));
    }

    try {
      // Find the user by email
      const existedUser = await userModel.findOne({ email });

      // If user is not found
      if (!existedUser) {
        console.error("User not found for email:", email);
        throw new ApiError(404, "User not found");
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, existedUser.password);

      if (isMatch) {
        //generate jwt
        const token = jwt.sign(
          { userID: existedUser._id },
          process.env.JWT_SECRET_KEY ||
            "pOpXsyY9GHlN8j92fHPy9rH9+IHN+71mUu2U99P5WfT",
          { expiresIn: "5d" }
        );
        existedUser.token = token;
        // User is authenticated successfully
        console.log("User logged in successfully:", email);
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              existedUser.token,
              "User logged in successfully"
            )
          );
      } else {
        // Passwords do not match
        console.error("Incorrect password for user:", email);
        throw new ApiError(401, "Invalid email or password");
      }
    } catch (error) {
      // Log the error and respond with a 500 status code
      console.error("Error during login:", error);
      return res
        .status(500)
        .json(new ApiResponse(500, null, "An error occurred during login"));
    }
  };
}
export default UserController;
