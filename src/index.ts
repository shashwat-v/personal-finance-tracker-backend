import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db/connectDB";
// import passport from "passport";
// import session from "express-session";
// import "./controllers/googelauth.controller";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
// app.use(
//   session({ secret: "your-secret", resave: false, saveUninitialized: true })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
import router from "./routes/user.route";
app.use("/api/user", router);

// Google Auth
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req: Request, res: Response) => {
//     res.redirect("/dashboard"); // Redirect to your dashboard or home page
//   }
// );

// app.get("/logout", (req: Request, res: Response, next: NextFunction) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.redirect("/");
//   });
// });

// Database Connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed!!!", err);
  });
