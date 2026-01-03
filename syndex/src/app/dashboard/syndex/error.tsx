'use client';

import { ErrorDisplay } from '@/components/syndex';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
                <ErrorDisplay
                    title="Something went wrong"
                    message={error.message || 'An unexpected error occurred'}
                    onRetry={reset}
                />
            </div>
        </main>
    );
}
