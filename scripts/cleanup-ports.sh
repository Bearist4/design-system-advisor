#!/bin/bash

# Script to clean up ports before running tests
# This helps avoid port conflicts between different test suites

echo "Cleaning up ports..."

# Kill any processes on port 3000
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "Killing processes on port 3000..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Kill any processes on port 3001 (backup port)
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "Killing processes on port 3001..."
    lsof -ti:3001 | xargs kill -9
    sleep 2
fi

echo "Port cleanup complete."
