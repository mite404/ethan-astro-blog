Read RALPH_SCOPE.md first, every iteration. Anything not granted there is out of scope:
note it in the ticket's `## Notes`, set `status: blocked`, commit, stop.

Then read RALPH_LAST_RESULT.json. If `gate.passed` is false, fix those failures before
starting new work — a red gate is inherited by every later ticket.

Pick the lowest-numbered ticket in docs/tickets/ with `status: todo` whose `Depends on:`
are all `done`. Set it to `doing`, commit that. Work on the branch its `Branch:` field
names. Never `but` — plain git only.

Work test-first where a test is possible. Commit only after ALL FOUR, in order:
  1. `bun install && bun run lint && bun run build` green
  2. Feature verified — for layout tickets, `bun run verify` (which you build in 006)
     passing at the widths the ticket names, screenshots captured, and `## Notes` saying
     what you expected vs what the screenshots show
  3. `/simplify` run in a sub-agent
  4. gate green again after that refactor

Then set `status: done` and commit.

NEVER `git push`, NEVER `git remote add` — github is blocked at the network layer anyway.
Do not edit CLAUDE.md or AGENTS.md. Record measured numbers in the ticket's `## Notes`;
fresh context each iteration means anything not written down is lost.
