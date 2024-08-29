import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db/connectDB";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies) to be sent with CORS requests
  })
);
app.use(express.json());
app.use(bodyParser.json());

// Routes
import router from "./routes/user.route";
app.use("/api/user", router);

// Google Auth (Optional if needed later)
// Uncomment these if you decide to use Google OAuth
// import passport from "passport";
// import session from "express-session";
// import "./controllers/googelauth.controller";

// app.use(
//   session({ secret: process.env.SESSION_SECRET || "your-secret", resave: false, saveUninitialized: true })
// );
// app.use(passport.initialize());
// app.use(passport.session());

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
