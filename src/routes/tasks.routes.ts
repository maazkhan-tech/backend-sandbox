import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as TasksController from "../controllers/tasks.controller.js";

const router = Router();

router.get("/", asyncHandler(TasksController.getAllTasks));
router.post("/", asyncHandler(TasksController.createTask));
router.get("/:id", asyncHandler(TasksController.getTaskById));
router.patch("/:id", asyncHandler(TasksController.updateTask));
router.delete("/:id", asyncHandler(TasksController.deleteTask));

export default router;
