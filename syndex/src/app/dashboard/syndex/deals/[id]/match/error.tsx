'use client';

import { ErrorDisplay } from '@/components/syndex';

export default function AIMatchingError({
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
                    title="AI Matching Failed"
                    message={error.message || 'The AI matching service encountered an error. Please try again.'}
                    onRetry={reset}
                />
            </div>
        </main>
    );
}
