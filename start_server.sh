#!/bin/bash
echo "Starting AI Shorts Generator Backend..."
cd "$(dirname "$0")/backend"
python -m uvicorn app:app --host 127.0.0.1 --port 8081
