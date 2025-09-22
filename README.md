# IrysUp App — Frontend Application

The web-based frontend for IrysUp, built with React and Tailwind CSS. This application enables creators and users to interact with the decentralized asset ecosystem — uploading, browsing, downloading, and storing creative content on the Irys DataChain.

## Overview

IrysUp App is a single-page application (SPA) that provides an intuitive interface for:

- Connecting Ethereum-compatible wallets (MetaMask, WalletConnect)
- Uploading and customizing digital assets (images, icons)
- Searching and downloading assets from the community
- Storing assets on-chain via Irys DataChain (testnet)
- Managing user sessions without centralized authentication

The frontend communicates with the IrysUp backend via REST API and directly with the Irys SDK for on-chain operations. All sensitive operations (e.g., password handling, signature generation) occur client-side.

## Architecture

- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Context + SWR for data fetching
- **Blockchain Integration**: Irys SDK, ethers.js
- **Authentication**: WalletConnect v2, EIP-191 signature verification
- **Deployment**: Vercel (production), local development via Vite
- **Browser Support**: Modern browsers (Chrome, Edge, Firefox, Safari)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/irysup/irysup-app.git
cd irysup-app
npm install
