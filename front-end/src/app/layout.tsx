import React from 'react';
import './globals.css';

export const metadata = {
    title: 'FateFi - DeFi meets prediction markets',
    description: 'Speculation-aware automated risk manager',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <div className="layout">
            <header className="navbar">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">FateFi</h1>
                </div>
                <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                        <li><a href="/" className="text-white hover:text-accent transition-colors">Home</a></li>
                        <li><a href="/markets" className="text-white hover:text-accent transition-colors">Markets</a>
                        </li>
                        <li><a href="/dashboard"
                               className="text-white hover:text-accent transition-colors">Dashboard</a></li>
                        <li>
                            <button className="btn btn-primary">Connect Wallet</button>
                        </li>
                    </ul>
                </nav>
                <button className="md:hidden text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            </header>
            <main>{children}</main>
            <footer className="mt-20 py-6 text-center text-textSecondary border-t border-border">
                <p>&copy; {new Date().getFullYear()} FateFi. All rights reserved.</p>
            </footer>
        </div>
        </body>
        </html>
    );
}