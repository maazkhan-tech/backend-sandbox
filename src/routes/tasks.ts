import { Router } from "express";
import {
  createTask,
  findTask,
  updateTask,
  deleteTask,
  getTasks,
  isValidCreateInput,
  isValidUpdateInput,
} from "../services/tasks.js";
const router = Router();

// GET /tasks
router.get("/", (_req, res) => {
  res.status(200).json({ success: true, data: getTasks() });
});

// POST /tasks
router.post("/", (req, res) => {
  if (!isValidCreateInput(req.body)) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid task payload" },
    });
  }

  const task = createTask(req.body);

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
  if (!isValidUpdateInput(req.body)) {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid update payload" },
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
