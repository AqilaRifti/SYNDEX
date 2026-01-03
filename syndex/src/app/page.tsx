import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { userId } = await auth();

  // If user is signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard/syndex');
  }

  // Otherwise, redirect to the marketing homepage
  redirect('/home');
}
