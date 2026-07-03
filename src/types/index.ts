export interface Task {
  id: number;
  title: string;
  description?: string | undefined;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ValidationResult =
  { valid: true } | { valid: false; message: string };

export type CreateTaskInput = Omit<
  Task,
  "id" | "completed" | "createdAt" | "updatedAt"
>;
export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completed?: boolean;
};
