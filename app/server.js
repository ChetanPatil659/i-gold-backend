import express from "express";
import cors from "cors";
import morgan from "morgan";
import { cros_origin, port } from "./configs/envConfig.js";
import { connectDB } from "./configs/dbConfig.js";
import router from "./routes/v1/router.js";
import paymentRoutes from "./routes/v1/paymentRoutes.js";

// create express app
export const app = express();

// connect to database
await connectDB();

// middlewares
app.use(morgan("dev"));
app.use(cors({ origin: cros_origin }));
app.use(express.json());

// router middleware
app.use("/api/v1", router);

// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 404 route not found
app.use("*", (req, res) => {
  res.status(404).send("Sorry, can't find that!");
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
