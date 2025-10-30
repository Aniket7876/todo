import HomeClient from '@/components/HomeClient';
import SignedOutHero from '@/components/SignedOutHero';
import { listTasks } from '@/lib/tasks';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <SignedOutHero />;
  }

  try {
    const tasks = await listTasks(userId);
    return <HomeClient initialTasks={tasks} />;
  } catch (error) {
    console.error('Failed to preload tasks', error);
    return (
      <HomeClient
        initialTasks={[]}
        initialError="We could not load your tasks. Please refresh or try again later."
      />
    );
  }
}
