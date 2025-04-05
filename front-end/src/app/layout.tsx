import React from 'react';
import './globals.css';
import AppWalletProvider from "../components/AppWalletProvider";

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
          <AppWalletProvider>
            {children}
          </AppWalletProvider>
          <footer className="mt-20 py-6 text-center text-textSecondary border-t border-border">
            <p>&copy; {new Date().getFullYear()} FateFi. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
