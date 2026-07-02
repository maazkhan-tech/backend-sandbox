import express from "express";
import type { NextFunction, Request, Response } from "express";
import tasksRouter from "./routes/tasks.js";

const app = express();

app.use(express.json());

app.use("/tasks", tasksRouter);

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    error: "Internal Server Error",
  });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
