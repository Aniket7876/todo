import { ObjectId } from 'mongodb';
import { getCollection } from './mongodb';
import { Task, TaskStatus } from '@/types/task';

const COLLECTION_NAME = 'tasks';

type TaskPriority = Task['priority'];

interface TaskDocument {
  _id: ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
}

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
};

export async function listTasks(): Promise<Task[]> {
  const collection = await getCollection<TaskDocument>(COLLECTION_NAME);
  const documents = await collection.find({}).sort({ createdAt: 1 }).toArray();
  return documents.map(mapTaskDocumentToTask);
}

export async function findTaskById(id: string): Promise<Task | null> {
  const objectId = parseObjectId(id);
  if (!objectId) {
    return null;
  }

  const collection = await getCollection<TaskDocument>(COLLECTION_NAME);
  const document = await collection.findOne({ _id: objectId });
  return document ? mapTaskDocumentToTask(document) : null;
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  const collection = await getCollection<TaskDocument>(COLLECTION_NAME);
  const now = new Date();
  const objectId = new ObjectId();

  const document: TaskDocument = {
    _id: objectId,
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: payload.status,
    priority: payload.priority,
    createdAt: now,
    updatedAt: now,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
  };

  await collection.insertOne(document);
  return mapTaskDocumentToTask(document);
}

export async function updateTask(id: string, payload: TaskPayload): Promise<Task | null> {
  const objectId = parseObjectId(id);
  if (!objectId) {
    return null;
  }

  const collection = await getCollection<TaskDocument>(COLLECTION_NAME);
  const updates: Partial<Omit<TaskDocument, '_id'>> = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: payload.status,
    priority: payload.priority,
    updatedAt: new Date(),
  };

  if (payload.dueDate !== undefined) {
    updates.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
  }

  const updatedDocument = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return updatedDocument ? mapTaskDocumentToTask(updatedDocument) : null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const objectId = parseObjectId(id);
  if (!objectId) {
    return false;
  }

  const collection = await getCollection<TaskDocument>(COLLECTION_NAME);
  const { deletedCount } = await collection.deleteOne({ _id: objectId });
  return deletedCount === 1;
}

function mapTaskDocumentToTask(document: TaskDocument): Task {
  return {
    id: document._id.toHexString(),
    title: document.title,
    description: document.description,
    status: document.status,
    priority: document.priority,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
    dueDate: document.dueDate ? document.dueDate.toISOString() : null,
  };
}

function parseObjectId(value: string): ObjectId | null {
  if (!ObjectId.isValid(value)) {
    return null;
  }

  return new ObjectId(value);
}
