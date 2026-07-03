import { Router } from "express";
import {
  createTask,
  findTask,
  updateTask,
  deleteTask,
  getTasks,
  validateUpdateInput,
  isValidTaskInput,
} from "../services/tasks.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../errors/AppError.js";
const router = Router();

// GET /tasks
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { completed } = req.query;
    if (
      completed !== undefined &&
      completed !== "true" &&
      completed !== "false"
    ) {
      throw new AppError(400, "completed must be 'true' or 'false'");
    }
    const filter = completed === undefined ? undefined : completed === "true";
    res.status(200).json({ success: true, data: getTasks(filter) });
  }),
);

// POST /tasks
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const result = isValidTaskInput(req.body);
    if (!result.valid) {
      throw new AppError(400, result.message);
    }
    const { title, description } = req.body;
    const task = createTask({ title, description });
    res.status(201).json({ success: true, data: task });
  }),
);

// GET /tasks/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, "ID must be a number");
    const task = findTask(id);
    if (!task) throw new AppError(404, "Task not found");
    res.status(200).json({ success: true, data: task });
  }),
);

// PATCH /tasks/:id
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, "ID must be a number");

    const result = validateUpdateInput(req.body);
    if (!result.valid) throw new AppError(400, result.message);
    const task = updateTask(id, req.body);
    if (!task) {
      throw new AppError(404, "Task not found");
    }
    res.status(200).json({ success: true, data: task });
  }),
);

// DELETE /tasks/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError(400, "ID must be a number");
    const deleted = deleteTask(id);
    if (!deleted) {
      throw new AppError(404, "Task not found");
    }
    res.status(204).send();
  }),
);

export default router;
