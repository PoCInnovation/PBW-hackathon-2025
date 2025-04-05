import React from 'react';
import { useRouter } from 'next/router';
import { useMarket } from '../../../hooks/useMarket';
import MarketDetails from '../../../components/MarketDetails';

const MarketPage = () => {
    const router = useRouter();
    const { marketId } = router.query;
    const { market, isLoading, error } = useMarket(marketId);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading market details.</div>;
    }

    return (
        <div>
            <h1>{market.title}</h1>
            <MarketDetails market={market} />
        </div>
    );
};

export default MarketPage;