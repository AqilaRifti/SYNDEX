import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SYNDEX - Intelligent Syndicated Loan Platform',
    description:
        'AI-powered syndicated loan origination and bank matching platform for modern financial institutions.'
};

export default function HomeLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
