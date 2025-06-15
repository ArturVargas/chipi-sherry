# Minithon Sherry Project

Pay your bills directly with crypto stablecoins on your favorite blockchain using sherry app and chipipay

[Video Demo](https://www.loom.com/share/3264cb2006e04b0389dcdc5fa6ff765b?sid=9398de12-ab01-4af7-b32a-cf1455b562a3)

[Sherry app](https://app.sherry.social/action?url=https://chipi-sherry.vercel.app/api/services)

[Chipi-Sherry Smart Contract](https://celo-alfajores.blockscout.com/address/0x5837d7635e7E9bf06245A75Ccd00A9a486Dd0b72)

[Celo Faucet](https://faucet.celo.org/alfajores)

## Findings

I was getting error with the version:

```bash
npm run build

> chipi-sherry-app@0.1.0 build
> next build

   ▲ Next.js 15.3.3

   Creating an optimized production build ...
Failed to compile.

./node_modules/@sherrylinks/sdk/dist/index.esm.js
Module not found: Can't resolve 'process/browser'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/app/api/services/route.ts


> Build failed because of webpack errors
```

[Solved in this commit updating the nextjs config file](https://github.com/ArturVargas/chipi-sherry/commit/719493caaef4c03151f9b2ef5ffbbc7583b7527b)

If My Wallet was in another chain different that the metadata config is, the app is still make the transaction and send in the current chain that I'm using on my wallet and not in the config chain on the app

https://sepolia.etherscan.io/tx/0x95fb2400fbae56987cbfb20167dd1c7449c5b2a0e5f1b226e7b08fb2fa9a9c55

The Tx Hash show in the sherry app is redirect to the avalanche fuji explorer, ignoring the chain id that I configure on my app (Celo Alfajores)

https://subnets-test.avax.network/c-chain/tx/0x95fb2400fbae56987cbfb20167dd1c7449c5b2a0e5f1b226e7b08fb2fa9a9c55

I couldn't find how to serialize 2 transactions as an array, I was trying to send approve and recharge transaction but I get an error
[this commit](https://github.com/ArturVargas/chipi-sherry/commit/39e29b88e9f8562e848f82da15c5d9e379cf464e)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
