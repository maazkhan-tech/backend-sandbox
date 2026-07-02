
import fs from "fs";

export interface Task {
  id: number;
  title: string;
  description?: string | undefined;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

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
  fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), (err) => {
    if (err) {
      console.error("Error writing tasks:", err);
    }
  });
}

export function getTasks(): Task[] {
  return readTasks();
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
    completed: input.completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);
  writeTasks(tasks);

  return newTask;
}

export function findTask(id: Number): Task | undefined {
  const tasks = readTasks();

  return tasks.find((task) => task.id === id);
}

export function updateTask(
  id: Number,
  input: UpdateTaskInput
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

export function deleteTask(id: Number): boolean {
  const tasks = readTasks();

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  writeTasks(tasks);

  return true;
}

export function isValidTaskInput(
  input: unknown
): input is CreateTaskInput {
  return (
    typeof input === "object" &&
    input !== null &&
    typeof (input as CreateTaskInput).title === "string" &&
    ((input as CreateTaskInput).description === undefined ||
      typeof (input as CreateTaskInput).description === "string") &&
    typeof (input as CreateTaskInput).completed === "boolean"
  );
}

export function isValidCreateInput(
  input: unknown
): input is CreateTaskInput {
  return isValidTaskInput(input);
}

export function isValidUpdateInput(
  input: unknown
): input is UpdateTaskInput {
  return (
    typeof input === "object" &&
    input !== null &&
    (input as UpdateTaskInput).title === undefined ||
    typeof (input as UpdateTaskInput).title === "string" &&
    ((input as UpdateTaskInput).description === undefined ||
      typeof (input as UpdateTaskInput).description === "string") &&
    ((input as UpdateTaskInput).completed === undefined ||
      typeof (input as UpdateTaskInput).completed === "boolean")
  );
} 

