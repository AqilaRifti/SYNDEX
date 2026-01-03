'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import {
    IconArrowRight,
    IconBuildingBank,
    IconChartBar,
    IconCurrencyDollar,
    IconRocket,
    IconShieldCheck,
    IconSparkles,
    IconUsers
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push('/dashboard/syndex');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return (
            <div className='flex h-screen items-center justify-center bg-background'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
            </div>
        );
    }

    if (isSignedIn) {
        return null;
    }

    return (
        <div className='relative min-h-screen overflow-x-hidden bg-background'>
            {/* Navigation */}
            <Header />

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Stats Section */}
            <StatsSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <Footer />
        </div>
    );
}

function Header() {
    return (
        <header className='fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                <Link href='/home' className='flex items-center gap-2'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-accent'>
                        <IconCurrencyDollar className='h-5 w-5 text-primary-foreground' />
                    </div>
                    <span className='text-xl font-bold tracking-tight'>SYNDEX</span>
                </Link>

                <nav className='hidden items-center gap-8 md:flex'>
                    <Link
                        href='#features'
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                        Features
                    </Link>
                    <Link
                        href='#stats'
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                        Platform
                    </Link>
                    <Link
                        href='#cta'
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                        Get Started
                    </Link>
                </nav>

                <div className='flex items-center gap-3'>
                    <Button variant='ghost' size='sm' asChild>
                        <Link href='/auth/sign-in'>Sign In</Link>
                    </Button>
                    <Button size='sm' className='glow-effect' asChild>
                        <Link href='/auth/sign-up'>
                            Get Started
                            <IconArrowRight className='ml-1 h-4 w-4' />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

function HeroSection() {
    return (
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden pt-16'>
            {/* Background Grid */}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]' />

            {/* Gradient Orbs */}
            <div className='absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]' />
            <div className='absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-[128px]' />

            <div className='relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8'>
                <div className='text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary'>
                            <IconSparkles className='h-4 w-4' />
                            AI-Powered Syndicated Loans
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='mt-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
                    >
                        Intelligent Bank Matching
                        <br />
                        <span className='bg-gradient-to-r from-accent via-accent to-accent bg-clip-text text-transparent'>
                            for Syndicated Loans
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl'
                    >
                        SYNDEX uses advanced AI to match your deals with the perfect banking
                        partners. Streamline origination, optimize syndication, and close
                        deals faster.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'
                    >
                        <Button size='lg' className='glow-effect bg-accent' asChild>
                            <Link href='/auth/sign-up'>
                                Start
                                <IconArrowRight className='ml-2 h-5 w-5' />
                            </Link>
                        </Button>
                        <Button size='lg' variant='outline' asChild>
                            <Link href='/auth/sign-in'>View Demo</Link>
                        </Button>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className='relative mx-auto mt-16 max-w-5xl'
                    >
                        <div className='terminal-window overflow-hidden rounded-xl border border-border p-1'>
                            <div className='flex items-center gap-2 border-b border-border bg-card/50 px-4 py-3'>
                                <div className='h-3 w-3 rounded-full bg-destructive/60' />
                                <div className='h-3 w-3 rounded-full bg-primary/60' />
                                <div className='h-3 w-3 rounded-full bg-accent/60' />
                                <span className='ml-4 text-sm text-muted-foreground'>
                                    SYNDEX Terminal
                                </span>
                            </div>
                            <div className='bg-card/30 p-6'>
                                <DashboardPreview />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function DashboardPreview() {
    return (
        <div className='grid gap-4 md:grid-cols-3'>
            {/* Deal Card */}
            <div className='rounded-lg border border-border bg-card p-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-xs text-muted-foreground'>Active Deals</span>
                    <IconChartBar className='h-4 w-4 text-primary' />
                </div>
                <p className='mt-2 text-2xl font-bold font-mono-data'>24</p>
                <p className='mt-1 text-xs text-accent'>+12% this month</p>
            </div>

            {/* Banks Card */}
            <div className='rounded-lg border border-border bg-card p-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-xs text-muted-foreground'>Bank Partners</span>
                    <IconBuildingBank className='h-4 w-4 text-primary' />
                </div>
                <p className='mt-2 text-2xl font-bold font-mono-data'>156</p>
                <p className='mt-1 text-xs text-accent'>Global network</p>
            </div>

            {/* Volume Card */}
            <div className='rounded-lg border border-border bg-card p-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-xs text-muted-foreground'>Total Volume</span>
                    <IconCurrencyDollar className='h-4 w-4 text-primary' />
                </div>
                <p className='mt-2 text-2xl font-bold font-mono-data'>$2.4B</p>
                <p className='mt-1 text-xs text-accent'>YTD facilitated</p>
            </div>
        </div>
    );
}

const features = [
    {
        icon: IconSparkles,
        title: 'AI-Powered Matching',
        description:
            'Our proprietary algorithm analyzes 50+ factors to match your deals with the most suitable banking partners.'
    },
    {
        icon: IconBuildingBank,
        title: 'Global Bank Network',
        description:
            'Access a curated network of 150+ institutional lenders across all major markets and sectors.'
    },
    {
        icon: IconRocket,
        title: 'Accelerated Execution',
        description:
            'Reduce deal cycle time by up to 60% with automated workflows and real-time collaboration tools.'
    },
    {
        icon: IconShieldCheck,
        title: 'Enterprise Security',
        description:
            'Bank-grade encryption, SOC 2 compliance, and granular access controls protect your sensitive data.'
    },
    {
        icon: IconChartBar,
        title: 'Market Intelligence',
        description:
            'Real-time market data, pricing benchmarks, and trend analysis to inform your syndication strategy.'
    },
    {
        icon: IconUsers,
        title: 'Team Collaboration',
        description:
            'Built-in workspaces for seamless collaboration between originators, syndicators, and banking partners.'
    }
];

function FeaturesSection() {
    return (
        <section id='features' className='relative py-24'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='text-center'>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='text-3xl font-bold tracking-tight sm:text-4xl'
                    >
                        Everything you need to
                        <br />
                        <span className='text-primary'>syndicate smarter</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className='mx-auto mt-4 max-w-2xl text-muted-foreground'
                    >
                        SYNDEX combines cutting-edge AI with deep financial expertise to
                        transform how syndicated loans are originated and distributed.
                    </motion.p>
                </div>

                <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className='card-hover group rounded-xl border border-border bg-card p-6'
                        >
                            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
                                <feature.icon className='h-6 w-6' />
                            </div>
                            <h3 className='mt-4 text-lg font-semibold'>{feature.title}</h3>
                            <p className='mt-2 text-sm text-muted-foreground'>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const stats = [
    { value: '$12B+', label: 'Deals Facilitated' },
    { value: '150+', label: 'Bank Partners' },
    { value: '60%', label: 'Faster Execution' },
    { value: '98%', label: 'Match Accuracy' }
];

function StatsSection() {
    return (
        <section
            id='stats'
            className='relative border-y border-border bg-card/50 py-24'
        >
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className='text-center'
                        >
                            <p className='text-4xl font-bold text-primary font-mono-data sm:text-5xl'>
                                {stat.value}
                            </p>
                            <p className='mt-2 text-muted-foreground'>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section id='cta' className='relative py-24'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 sm:p-12 lg:p-16'
                >
                    <div className='relative z-10 text-center'>
                        <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                            Ready to transform your
                            <br />
                            syndication workflow?
                        </h2>
                        <p className='mx-auto mt-4 max-w-xl text-muted-foreground'>
                            Join leading financial institutions already using SYNDEX to
                            streamline their syndicated loan operations.
                        </p>
                        <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                            <Button size='lg' className='glow-effect' asChild>
                                <Link href='/auth/sign-up'>
                                    Start Free Trial
                                    <IconArrowRight className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                            <Button size='lg' variant='outline' asChild>
                                <Link href='/auth/sign-in'>Contact Sales</Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className='border-t border-border bg-card/30 py-12'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
                    <div className='flex items-center gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
                            <IconCurrencyDollar className='h-4 w-4 text-primary-foreground' />
                        </div>
                        <span className='font-bold'>SYNDEX</span>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        © {new Date().getFullYear()} SYNDEX. All rights reserved.
                    </p>
                    <div className='flex gap-6'>
                        <Link
                            href='/terms'
                            className='text-sm text-muted-foreground hover:text-foreground'
                        >
                            Terms
                        </Link>
                        <Link
                            href='/privacy'
                            className='text-sm text-muted-foreground hover:text-foreground'
                        >
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
