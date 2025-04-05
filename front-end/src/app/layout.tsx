import React from 'react';
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
          <header>
            <h1>FateFi</h1>
            {/* Add navigation components here */}
          </header>
          <main>
            <AppWalletProvider>{children}</AppWalletProvider>
          </main>
          <footer>
            <p>&copy; {new Date().getFullYear()} FateFi. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
