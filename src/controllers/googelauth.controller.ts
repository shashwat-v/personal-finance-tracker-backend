import { Request, Response } from "express";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { userModel, IUser } from "../models/user.model";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.body;

  try {
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ error: "Invalid token payload" });
      return;
    }

    const googleId = payload.sub;
    const email = payload.email || "";
    const fullname = payload.name || "";

    // First, try to find the user by googleId
    let user: IUser | null = await userModel.findOne({ googleId });

    if (!user) {
      // If user is not found by googleId, try to find by email
      user = await userModel.findOne({ email });

      if (user) {
        // If user is found by email, update the user's googleId
        user.googleId = googleId;
        await user.save();
      }
    }

    if (!user) {
      // User not found by either googleId or email, respond with a message indicating the user should sign up
      res.status(404).json({ message: "User not found. Please sign up." });
    } else {
      // User found, respond with user data
      res.json({ user, message: "User authenticated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
};

// import { Request, Response } from "express";
// import axios from "axios";
// import { userModel, IUser } from "../models/user.model";

// export const googleAuth = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { token } = req.body;
//   const clientId = process.env.GOOGLE_CLIENT_ID;
//   const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

//   if (!token) {
//     console.error("Token is missing");
//     res.status(400).json({ error: "Token is required" });
//     return;
//   }

//   try {
//     console.log("Exchanging code for tokens...");
//     const response = await axios.post("https://oauth2.googleapis.com/token", {
//       code: token,
//       client_id: clientId,
//       client_secret: clientSecret,
//       redirect_uri: "http://localhost",
//       grant_type: "authorization_code",
//     });

//     const { id_token } = response.data;

//     console.log("Fetching user info from Google...");
//     const userInfoResponse = await axios.get(
//       `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
//     );
//     const userInfo = userInfoResponse.data;

//     console.log("User info received:", userInfo);

//     // First, try to find the user by googleId
//     let user: IUser | null = await userModel.findOne({
//       googleId: userInfo.sub,
//     });

//     if (!user) {
//       // If user is not found by googleId, try to find by email
//       console.log("User not found by Google ID, trying by email...");
//       user = await userModel.findOne({ email: userInfo.email });

//       if (user) {
//         console.log("User found by email, updating Google ID...");
//         // If user is found by email, update the user's googleId
//         user.googleId = userInfo.sub;
//         await user.save();
//       }
//     }

//     if (!user) {
//       // User not found by either googleId or email, respond with a message indicating the user should sign up
//       console.log("User not found by Google ID or email");
//       res.status(404).json({ message: "User not found. Please sign up." });
//     } else {
//       // User found, respond with user data
//       console.log("User authenticated successfully:", user);
//       res.json({ user, message: "User authenticated successfully" });
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error:", error.message);
//       console.error("Response data:", error.response?.data);
//       console.error("Response status:", error.response?.status);
//     } else {
//       console.error("Unexpected error:", error);
//     }
//     res.status(500).json({ error: "Failed to authenticate user" });
//   }
// };

// // import passport from "passport";
// // import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
// // import { userModel, IUser } from "../models/user.model";

// // passport.use(
// //   new GoogleStrategy(
// //     {
// //       clientID: process.env.GOOGLE_CLIENT_ID!,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// //       callbackURL: "/auth/google/callback",
// //     },
// //     async (
// //       accessToken: string,
// //       refreshToken: string,
// //       profile: Profile,
// //       done: (error: any, user?: any) => void
// //     ) => {
// //       try {
// //         let user: IUser | null = await userModel.findOne({
// //           googleId: profile.id,
// //         });
// //         if (!user) {
// //           user = await userModel.create({
// //             googleId: profile.id,
// //             email: profile.emails ? profile.emails[0].value : "",
// //             fullname: profile.displayName,
// //             phoneNumber: "", // You can ask the user to fill this field later if needed
// //           });
// //         }
// //         done(null, user);
// //       } catch (err) {
// //         done(err);
// //       }
// //     }
// //   )
// // );

// // passport.serializeUser((user: any, done: (error: any, id?: string) => void) => {
// //   done(null, user.id);
// // });

// // passport.deserializeUser(
// //   (id: string, done: (error: any, user?: any) => void) => {
// //     userModel.findById(id, (err: any, user: IUser | null) => {
// //       done(err, user);
// //     });
// //   }
// // );
