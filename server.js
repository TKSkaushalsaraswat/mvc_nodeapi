import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import connetctDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

connetctDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (_, res) => {
  res.send("Api Is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
