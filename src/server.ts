import express from "express";
import tasksRouter from "./routes/tasks.routes.js";
import morgan from "morgan";
import cors from "cors";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

const isProduction = config.nodeEnv === "production";
app.use(morgan(isProduction ? "combined" : "dev"));

app.use("/tasks", tasksRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Cannot ${req.method} ${req.url}` },
  });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
