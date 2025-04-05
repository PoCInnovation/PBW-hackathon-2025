"use client";

import { useEffect, useState } from 'react';

// Mock wallet data for development
export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        // Simulate wallet connection
        const mockConnect = () => {
            const mockAddress = "5Zzguz4NsSRFxGkHfM4RDEdiC8nvASqhtFNbAGzCcnJx";
            const mockBalance = 10.5;
            
            setTimeout(() => {
                setWalletAddress(mockAddress);
                setBalance(mockBalance);
                setConnected(true);
            }, 500);
        };

        mockConnect();
    }, []);

    const connect = () => {
        // This would be real wallet connection code
        console.log("Connecting wallet...");
    };

    const disconnect = () => {
        // This would be real wallet disconnect code
        setWalletAddress(null);
        setBalance(0);
        setConnected(false);
    };

    return {
        walletAddress,
        balance,
        connected,
        connect,
        disconnect
    };
};

export default useWallet;