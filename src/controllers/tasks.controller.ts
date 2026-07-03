import type { Request, Response, NextFunction } from "express";
import * as TaskService from "../services/tasks.service.js";
import { AppError } from "../errors/AppError.js";


// Controller functions for handling task-related requests

export async function getAllTasks(req: Request, res: Response): Promise<void> {
  const { completed } = req.query;

  if (
    completed !== undefined &&
    completed !== "true" &&
    completed !== "false"
  ) {
    throw new AppError(400, "completed must be 'true' or 'false'");
  }

  const filter = completed === undefined ? undefined : completed === "true";
  const tasks = TaskService.getTasks(filter);
  res.status(200).json({ success: true, data: tasks });
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const result = TaskService.validateCreateInput(req.body);
  if (!result.valid) throw new AppError(400, result.message);

  const { title, description } = req.body;
  const task = TaskService.createTask({ title, description });
  res.status(201).json({ success: true, data: task });
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError(400, "ID must be a number");

  const task = TaskService.findTaskById(id);
  if (!task) throw new AppError(404, "Task not found");

  res.status(200).json({ success: true, data: task });
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError(400, "ID must be a number");

  const result = TaskService.validateUpdateInput(req.body);
  if (!result.valid) throw new AppError(400, result.message);

  const task = TaskService.updateTask(id, req.body);
  if (!task) throw new AppError(404, "Task not found");

  res.status(200).json({ success: true, data: task });
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError(400, "ID must be a number");

  const deleted = TaskService.deleteTask(id);
  if (!deleted) throw new AppError(404, "Task not found");

  res.status(204).send();
}
