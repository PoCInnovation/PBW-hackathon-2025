#!/bin/bash

# Set error handling
set -e

echo "=== Creating Demo Tasks ==="

# Create a task for BTC price > 150
echo ""
echo "Creating task for BTC price > 150..."
anchor run create-task

# Modify the create-task.ts file to create a task for ETH price
sed -i 's/const marketId = "polymarket_btc_price";/const marketId = "polymarket_eth_price";/g' scripts/create-task.ts
sed -i 's/const expectedValue = new anchor.BN(150);/const expectedValue = new anchor.BN(3500);/g' scripts/create-task.ts

echo ""
echo "Creating task for ETH price > 3500..."
anchor run create-task

# Modify the create-task.ts file to create a task for SOL price
sed -i 's/const marketId = "polymarket_eth_price";/const marketId = "polymarket_sol_price";/g' scripts/create-task.ts
sed -i 's/const expectedValue = new anchor.BN(3500);/const expectedValue = new anchor.BN(200);/g' scripts/create-task.ts

echo ""
echo "Creating task for SOL price > 200..."
anchor run create-task

# Restore the original values in create-task.ts
sed -i 's/const marketId = "polymarket_sol_price";/const marketId = "polymarket_btc_price";/g' scripts/create-task.ts
sed -i 's/const expectedValue = new anchor.BN(200);/const expectedValue = new anchor.BN(150);/g' scripts/create-task.ts

echo ""
echo "=== Demo tasks created! ==="
echo "Check your tasks with: anchor run get-tasks"
echo ""
echo "Test triggering tasks with:"
echo "anchor run update-market -- polymarket_btc_price 200"
echo "anchor run update-market -- polymarket_eth_price 4000"
echo "anchor run update-market -- polymarket_sol_price 250"
echo ""
echo "Then check and execute with:"
echo "anchor run check-execute -- <task_id>" 