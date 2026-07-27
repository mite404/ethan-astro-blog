#!/bin/bash
# Ralph run config for ethan-astro-blog. The env below is the whole orchestration:
# which sandbox, where progress lives, what the overseer measures after each iteration.
set -e
export RALPH_SANDBOX=ralph-astro
export RALPH_MODE=clone
export CHANGES_DIR=docs/tickets          # tickets ARE the change files
export RALPH_MODEL=sonnet                # plans came from opus; execution is sonnet
export RALPH_EFFORT=high
# The overseer runs this ITSELF after every iteration — ground truth, not Ralph's claim —
# and writes the result to RALPH_LAST_RESULT.json for the next iteration to read.
export RALPH_GATE_CMD='bun install && bun run lint && bun run build'

case "${1:-}" in
  supervised) shift; exec ./supervisor.sh "$@" ;;   # overseer: retries, gives up, stops on done
  *)          exec ./loop.sh "$@" ;;                # bounded: ./run-ralph.sh 1
esac
