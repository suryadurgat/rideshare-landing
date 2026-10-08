#!/bin/sh
set -eu
cd /workspace

if curl -sf -o /dev/null http://127.0.0.1:8080/; then
  exit 0
fi

npm run dev > /tmp/rideshare-dev.log 2>&1 &

i=0
while [ "$i" -lt 60 ]; do
  if curl -sf -o /dev/null http://127.0.0.1:8080/; then
    exit 0
  fi
  i=$((i + 1))
  sleep 0.5
done

echo "dev server failed to start" >&2
tail -n 80 /tmp/rideshare-dev.log >&2 || true
exit 1
