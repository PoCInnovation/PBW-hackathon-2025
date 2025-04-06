<img src="front-end/public/logo.png" alt="Logo" width="200"/>

# FateFi

When DeFi meets prediction markets.

## How does it work?

FateFi uses Solana smart contracts to manage automated token swaps based on prediction market outcomes. The system:

1. Monitors prediction market prices/probabilities via on-chain oracles
2. Executes swaps when user-defined thresholds are crossed
3. Provides a risk management layer on top of prediction markets

Users deposit tokens (e.g. SOL), choose a market (e.g. "Will ETH be above $4k by June?"), and define:

- Target Token – the asset to swap into if the prediction passes a set threshold.
- Downside Plan – the asset to swap into (usually a stablecoin) if the prediction weakens.

📈 If the prediction crosses a positive threshold (e.g. >65%), the user swaps into a bullish asset.
<br/>
📉 If it drops below a protective threshold (e.g. <35%), they swap into safety.
Think of it as a speculation-aware automated risk manager.


The core logic is built with Anchor framework and integrates with various DeFi protocols for token swaps.

## Getting Started

### Installation

```bash
cd front-end
npm install
```

### Quickstart

FateFi contracts address: `GfJp5WgVVvSkxdAGSRKEgfjZXdDKPWorNKBQ7sWFE5uD`

```bash
cd front-end
npm run dev
```

### Usage

1. Connect your Solana wallet using the wallet adapter
2. Select a prediction market to participate in
3. Define your target token and downside plan
4. Set your threshold parameters
5. Deposit tokens to activate your strategy
6. Monitor your positions in the dashboard

## Get involved

You're invited to join this project ! Check out the [contributing guide](./CONTRIBUTING.md).

If you're interested in how the project is organized at a higher level, please contact the current project manager.

## Our PoC team ❤️

Developers
| [<img src="https://github.com/Molaryy.png?size=85" width=85><br><sub>Mohammed JBILOU</sub>](https://github.com/Molaryy) | [<img src="https://github.com/Sacharbon.png?size=85" width=85><br>Sacha DUJARDIN<sub></sub>](https://github.com/Sacharbon) | [<img src="https://github.com/intermarch3.png?size=85" width=85><br><sub>Lucas LECLERC</sub>](https://github.com/intermarch3) | [<img src="https://github.com/eliestroun14.png?size=85" width=85><br><sub>Elie STROUN</sub>](https://github.com/eliestroun14)
| :---: | :---: | :---: | :---: |


<h2 align=center>
Organization
</h2>

<p align='center'>
    <a href="https://www.linkedin.com/company/pocinnovation/mycompany/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn logo">
    </a>
    <a href="https://www.instagram.com/pocinnovation/">
        <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram logo"
>
    </a>
    <a href="https://twitter.com/PoCInnovation">
        <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter logo">
    </a>
    <a href="https://discord.com/invite/Yqq2ADGDS7">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Discord logo">
    </a>
</p>
<p align=center>
    <a href="https://www.poc-innovation.fr/">
        <img src="https://img.shields.io/badge/WebSite-1a2b6d?style=for-the-badge&logo=GitHub Sponsors&logoColor=white" alt="Website logo">
    </a>
</p>

> 🚀 Don't hesitate to follow us on our different networks, and put a star 🌟 on `PoC's` repositories

> Made with ❤️ by PoC