module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  env: {
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL, // Example environment variable
  },
};