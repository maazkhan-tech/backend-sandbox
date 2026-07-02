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
const router = Router();

// GET /tasks
router.get("/", (_req, res) => {
  const { completed } = _req.query;
  if (
    completed !== undefined &&
    completed !== "true" &&
    completed !== "false"
  ) {
    return res.status(400).json({
      success: false,
      error: {
        message: "completed must be 'true' or 'false'",
      },
    });
  }
  const filter = completed === undefined ? undefined : completed === "true";
  res.status(200).json({ success: true, data: getTasks(filter) });
});

// POST /tasks
router.post("/", (req, res) => {
  const { valid, message } = isValidTaskInput(req.body);
  if (!valid) {
    return res.status(400).json({
      success: false,
      error: { message },
    });
  }
  const { title, description } = req.body;
  const task = createTask({ title, description });
  res.status(201).json({ success: true, data: task });
});

// GET /tasks/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: { message: "ID must be a number" } });
  }

  const task = findTask(id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: { message: "Task not found" },
    });
  }

  res.status(200).json({ success: true, data: task });
});

// PATCH /tasks/:id
router.patch("/:id", (req, res) => {
  const { valid, message } = validateUpdateInput(req.body);
  if (!valid) {
    return res.status(400).json({
      success: false,
      error: { message },
    });
  }
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: { message: "ID must be a number" } });
  }
  const task = updateTask(id, req.body);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: { message: "Task not found" },
    });
  }

  res.status(200).json({ success: true, data: task });
});

// DELETE /tasks/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: { message: "ID must be a number" } });
  }
  const deleted = deleteTask(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: { message: "Task not found" },
    });
  }

  res.status(204).send();
});

export default router;
