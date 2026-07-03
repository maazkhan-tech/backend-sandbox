import express from "express";
import tasksRouter from "./routes/tasks.routes.js";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";
app.use(morgan(isProduction ? "combined" : "dev"));

app.use("/tasks", tasksRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Cannot ${req.method} ${req.url}` },
  });
});

// 6. Error handler — always last
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
