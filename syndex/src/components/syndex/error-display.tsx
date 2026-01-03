'use client';

/**
 * SYNDEX Error Display Component
 * Error message with retry functionality
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    onRetry,
    className,
}: ErrorDisplayProps) {
    return (
        <Card className={cn('terminal-window border-destructive/50', className)}>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-destructive/20 p-4 mb-4">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">{message}</p>

                {onRetry && (
                    <Button variant="outline" onClick={onRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default ErrorDisplay;
