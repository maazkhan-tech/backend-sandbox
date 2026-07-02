import fs from "fs";

export interface Task {
  id: number;
  title: string;
  description?: string | undefined;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export type CreateTaskInput = Omit<
  Task,
  "id" | "completed" | "createdAt" | "updatedAt"
>;
export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completed?: boolean;
};

const TASKS_FILE = "tasks.json";

function readTasks(): Task[] {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return [];
    }

    const data = fs.readFileSync(TASKS_FILE, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks:", error);
    return [];
  }
}

function writeTasks(tasks: Task[]): void {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}
export function getTasks(done?: boolean): Task[] {
  const tasks = readTasks();
  if (done === undefined) {
    return tasks;
  }
  return tasks.filter((task) => task.completed === done);
}

export function createTask(input: CreateTaskInput): Task {
  const tasks = readTasks();

  const nextId =
    tasks.length > 0
      ? Math.max(...tasks.map((task) => Number(task.id))) + 1
      : 1;

  const newTask: Task = {
    id: nextId,
    title: input.title,
    description: input.description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);
  writeTasks(tasks);

  return newTask;
}

export function findTask(id: number): Task | undefined {
  const tasks = readTasks();

  return tasks.find((task) => task.id === id);
}

export function updateTask(
  id: number,
  input: UpdateTaskInput,
): Task | undefined {
  const tasks = readTasks();

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return undefined;
  }

  if (input.title !== undefined) {
    task.title = input.title;
  }

  if (input.description !== undefined) {
    task.description = input.description;
  }

  if (input.completed !== undefined) {
    task.completed = input.completed;
  }

  task.updatedAt = new Date();

  writeTasks(tasks);

  return task;
}

export function deleteTask(id: number): boolean {
  const tasks = readTasks();

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  writeTasks(tasks);

  return true;
}

export function isValidTaskInput(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { valid: false, message: "Request body must be a JSON object" };
  }

  const body = input as Record<string, unknown>;

  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return {
      valid: false,
      message: "title is required and must be a non-empty string",
    };
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    return { valid: false, message: "description must be a string" };
  }

  return { valid: true };
}

export function validateUpdateInput(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { valid: false, message: "Request body must be a JSON object" };
  }

  const body = input as Record<string, unknown>;

  const hasTitle = body.title !== undefined;
  const hasDone = body.completed !== undefined;

  if (!hasTitle && !hasDone) {
    return { valid: false, message: "Provide at least title or completed" };
  }

  if (
    hasTitle &&
    (typeof body.title !== "string" ||
      (body.title as string).trim().length === 0)
  ) {
    return { valid: false, message: "title must be a non-empty string" };
  }

  if (hasDone && typeof body.completed !== "boolean") {
    return { valid: false, message: "completed must be a boolean" };
  }

  return { valid: true };
}
