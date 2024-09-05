import { Inter } from 'next/font/google';
import './globals.css';
import { ProviderContainer } from '@/providers/providerContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'URL Shortener',
    description: 'Generate short URL',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="h-screen w-screen">
                    <ProviderContainer>{children}</ProviderContainer>
                </main>
            </body>
        </html>
    );
}
