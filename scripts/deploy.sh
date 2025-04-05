#!/bin/bash

# Set error handling
set -e

echo "=== FateFi Contract Deployment Script ==="
echo "Building and deploying contracts..."

# Build and deploy the program
anchor build
anchor deploy

# Initialize the contracts
echo ""
echo "=== Initializing contracts ==="
anchor run initialize

echo ""
echo "=== Setting up initial market values ==="
anchor run update-market -- polymarket_btc_price 100
anchor run update-market -- polymarket_eth_price 3000
anchor run update-market -- polymarket_sol_price 150

echo ""
echo "=== Deployment and initialization complete! ==="
echo "You can now create tasks with: anchor run create-task"
echo "View tasks with: anchor run get-tasks"
echo "Check and execute tasks with: anchor run check-execute -- <task_id>"
echo "Update market values with: anchor run update-market -- <market_id> <value>" 