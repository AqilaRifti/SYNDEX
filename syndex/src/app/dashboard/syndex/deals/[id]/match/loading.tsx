import { LoadingSpinner } from '@/components/syndex';

export default function Loading() {
    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" message="Initializing AI Matching..." />
            </div>
        </main>
    );
}
