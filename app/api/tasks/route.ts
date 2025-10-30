import { NextResponse } from 'next/server';
import { createTask, listTasks } from '@/lib/tasks';
import { validateTaskPayload, ValidationError } from './validation';

export async function GET() {
  try {
    const tasks = await listTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error('Invalid JSON payload', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const normalizedPayload = validateTaskPayload(payload);
    const task = await createTask(normalizedPayload);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Failed to create task', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
