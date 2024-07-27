// import passport from "passport";
// import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
// import { UserModel, IUser } from "../models/user.model";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "/auth/google/callback",
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile: Profile,
//       done: (error: any, user?: any) => void
//     ) => {
//       try {
//         let user: IUser | null = await UserModel.findOne({
//           googleId: profile.id,
//         });
//         if (!user) {
//           user = await UserModel.create({
//             googleId: profile.id,
//             email: profile.emails ? profile.emails[0].value : "",
//             fullname: profile.displayName,
//             phoneNumber: "", // You can ask the user to fill this field later if needed
//           });
//         }
//         done(null, user);
//       } catch (err) {
//         done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done: (error: any, id?: string) => void) => {
//   done(null, user.id);
// });

// passport.deserializeUser(
//   (id: string, done: (error: any, user?: any) => void) => {
//     UserModel.findById(id, (err: any, user: IUser | null) => {
//       done(err, user);
//     });
//   }
// );
