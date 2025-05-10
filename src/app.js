import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middlewares.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Use the user routes
app.use("/users", userRoutes);

// Error-handling middleware (should be the last middleware)
app.use(errorMiddleware);

export { app };
