'use client';

import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconCurrencyDollar, IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
      {/* Logo */}
      <Link href='/home' className='mb-8 flex items-center gap-2'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
          <IconCurrencyDollar className='h-6 w-6 text-primary-foreground' />
        </div>
        <span className='text-2xl font-bold tracking-tight'>SYNDEX</span>
      </Link>

      {/* 404 */}
      <span className='bg-gradient-to-b from-foreground to-foreground/20 bg-clip-text text-[10rem] font-extrabold leading-none text-transparent'>
        404
      </span>

      <h2 className='my-4 text-2xl font-bold'>Page not found</h2>
      <p className='mb-8 max-w-md text-center text-muted-foreground'>
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>

      <div className='flex gap-3'>
        <Button onClick={() => router.back()} variant='outline' size='lg'>
          <IconArrowLeft className='mr-2 h-4 w-4' />
          Go back
        </Button>
        <Button asChild size='lg'>
          <Link href='/home'>
            <IconHome className='mr-2 h-4 w-4' />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
