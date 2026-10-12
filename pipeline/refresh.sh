#!/bin/sh
# Weekly RSS watch for the Activity Vault. Queues candidates for human review;
# never publishes. No API keys needed.
cd "$(dirname "$0")/.." && python3 pipeline/scan.py
