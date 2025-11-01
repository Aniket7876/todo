import HomeClient from '@/components/HomeClient';
import { listTasks } from '@/lib/tasks';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUserFromCookies();
  if (!user) {
    redirect('/login');
  }

  try {
    const tasks = await listTasks(user.id);
    return <HomeClient initialTasks={tasks} currentUser={user} />;
  } catch (error) {
    console.error('Failed to preload tasks', error);
    return (
      <HomeClient
        initialTasks={[]}
        initialError="We could not load your tasks. Please refresh or try again later."
        currentUser={user}
      />
    );
  }
}
