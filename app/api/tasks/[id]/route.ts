import { NextResponse } from 'next/server';
import { deleteTask, findTaskById, updateTask } from '@/lib/tasks';
import { validateTaskPayload, ValidationError } from '../validation';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const task = await findTaskById(context.params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Failed to fetch task', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error('Invalid JSON payload', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const normalizedPayload = validateTaskPayload(payload);
    const task = await updateTask(context.params.id, normalizedPayload);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Failed to update task', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const deleted = await deleteTask(context.params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

  return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete task', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
