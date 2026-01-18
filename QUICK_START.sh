#!/bin/bash

# Quick start script for habit strength system

echo "🚀 Starting Convex deployment..."
echo ""
echo "This will:"
echo "1. Deploy the schema with habit strength fields"
echo "2. Deploy all functions"
echo "3. Keep Convex running"
echo ""
echo "Press Ctrl+C to stop when you're done."
echo ""

cd "$(dirname "$0")"
npx convex dev
