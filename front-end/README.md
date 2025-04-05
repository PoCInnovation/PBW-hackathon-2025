# FateFi - DeFi Meets Prediction Markets

FateFi is a decentralized finance (DeFi) platform that integrates prediction markets, allowing users to deposit tokens and make informed predictions on various market outcomes. 

## Project Overview

In FateFi, users can deposit tokens (e.g., SOL) and choose from a variety of markets, such as "Will ETH be above $4k by June?". Users can define their strategies through two main components:

- **Target Token**: The asset to swap into if the prediction crosses a positive threshold.
- **Downside Plan**: The asset to swap into (usually a stablecoin) if the prediction weakens.

### How It Works

1. **Positive Threshold**: If the prediction crosses a positive threshold (e.g., >65%), the user swaps into a bullish asset.
2. **Protective Threshold**: If the prediction drops below a protective threshold (e.g., <35%), the user swaps into a safety asset.

This mechanism acts as a speculation-aware automated risk manager, helping users manage their investments effectively.

## Features

- User-friendly interface inspired by Raydium's Swap page.
- Ability to select and manage multiple prediction markets.
- Automated asset swapping based on user-defined thresholds.
- Integration with the Solana blockchain for fast and secure transactions.

## Getting Started

To get started with FateFi, clone the repository and install the necessary dependencies:

```bash
git clone <repository-url>
cd fatefi
npm install
```

### Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file provided. Ensure to fill in the required environment variables.

### Running the Application

To run the application in development mode, use:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to access the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.