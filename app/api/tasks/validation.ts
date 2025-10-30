import { Task, TaskStatus } from '@/types/task';
import { TaskPayload } from '@/lib/tasks';

const VALID_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];

export class ValidationError extends Error {}

export function validateTaskPayload(input: unknown): TaskPayload {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Request body must be an object.');
  }

  const data = input as Record<string, unknown>;

  const title = coerceRequiredString(data.title, 'title');
  const description = coerceRequiredString(data.description, 'description');
  const status = coerceStatus(data.status);
  const priority = coercePriority(data.priority);
  const dueDate = coerceOptionalDate(data.dueDate);

  return {
    title,
    description,
    status,
    priority,
    ...(dueDate !== undefined ? { dueDate } : {}),
  };
}

function coerceRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`Field "${fieldName}" must be a string.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new ValidationError(`Field "${fieldName}" is required.`);
  }

  return trimmed;
}

function coerceStatus(value: unknown): TaskStatus {
  if (typeof value !== 'string' || !VALID_STATUSES.includes(value as TaskStatus)) {
    throw new ValidationError('Field "status" must be one of: todo, in-progress, done.');
  }

  return value as TaskStatus;
}

function coercePriority(value: unknown): Task['priority'] {
  if (typeof value !== 'string' || !VALID_PRIORITIES.includes(value as Task['priority'])) {
    throw new ValidationError('Field "priority" must be one of: low, medium, high.');
  }

  return value as Task['priority'];
}

function coerceOptionalDate(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    throw new ValidationError('Field "dueDate" must be a date string.');
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    throw new ValidationError('Field "dueDate" must be a valid date.');
  }

  return new Date(timestamp).toISOString();
}
