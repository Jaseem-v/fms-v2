#!/bin/bash

# Set your backend URL here (for development)
export BACKEND_URL="http://localhost:4000/api"

# Start the Next.js development server
echo "Starting development server with backend URL: $BACKEND_URL"
npm run dev 