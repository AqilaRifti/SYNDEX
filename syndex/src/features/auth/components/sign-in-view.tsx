'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { IconArrowLeft, IconCurrencyDollar } from '@tabler/icons-react';
import Link from 'next/link';
import { InteractiveGridPattern } from './interactive-grid';

export default function SignInViewPage({ stars }: { stars: number }) {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Back to Home Button */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute left-4 top-4 md:left-8 md:top-8'
        asChild
      >
        <Link href='/home'>
          <IconArrowLeft className='mr-2 h-4 w-4' />
          Back to Home
        </Link>
      </Button>

      {/* Left Panel - Branding */}
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />

        {/* Logo */}
        <div className='relative z-20 flex items-center gap-2 text-lg font-medium'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary'>
            <IconCurrencyDollar className='h-5 w-5 text-primary-foreground' />
          </div>
          <span className='text-xl font-bold tracking-tight'>SYNDEX</span>
        </div>

        {/* Interactive Grid Background */}
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />

        {/* Testimonial */}
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;SYNDEX has transformed how we approach syndicated loans.
              The AI matching saves us weeks of manual outreach and delivers
              better results.&rdquo;
            </p>
            <footer className='text-sm text-muted-foreground'>
              — Head of Syndication, Global Investment Bank
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* Mobile Logo */}
          <div className='flex items-center gap-2 lg:hidden'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary'>
              <IconCurrencyDollar className='h-5 w-5 text-primary-foreground' />
            </div>
            <span className='text-xl font-bold tracking-tight'>SYNDEX</span>
          </div>

          {/* Heading */}
          <div className='text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Sign in to your account to continue
            </p>
          </div>

          {/* Clerk Sign In Form */}
          <ClerkSignInForm />

          {/* Terms */}
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By signing in, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
