# RALPH_SCOPE.md

## Goal

Two workstreams from `docs/tickets/README.md`: replace `transform: scale()` with fluid
CSS (001–006), then the scroll experiments (007–011). Read that README first.

## Environment (already set up — do not redo)

- Sandbox `ralph-astro`, 8 GB / 4 cpu, private clone. Host repo untouched.
- `bun` 1.3.14 at `~/.bun/bin` — **already on PATH inside the loop**.
- `node_modules` installed; `playwright` + Chromium downloaded and working.
- Branch `fluid-responsive-portfolio`, based on `update-for-ralph`.

**Constraints discovered while building this environment — trust them, they cost time:**

- `astro preview` does **not** serve this build (netlify adapter). Use `astro dev`.
- The build fetches fonts from `cdn.jsdelivr.net`; it is allowlisted. Without it the
  build dies with `Cannot read properties of null (reading 'countFamilies')`.
- `chrome-devtools MCP` (which ticket 006 names) **does not exist in a sandbox** — MCP
  servers do not transfer. Use Playwright instead; it is installed for this reason.

## In scope

Tickets carry `status:` frontmatter. Take the lowest-numbered `todo` whose `Depends on:`
are all `done`. Honour each ticket's `Branch:` field — 001–006 on
`fluid-responsive-portfolio`, 007–011 on `scroll-experiments` (create it from
`fluid-responsive-portfolio` when you first need it). **Do not mix the two workstreams
in one commit.**

## Out of scope

- **000 branch setup** — assumes GitButler and the `but` CLI; neither exists here.
  Branching is done for you. Use plain `git switch -c`, never `but`.
- `git push`, `git remote add`, deploys, Netlify, external accounts.
- Editing `CLAUDE.md`, `AGENTS.md`, `docs/tickets/README.md`.
- Changing any ticket file except its own `status:` and `## Notes`.

## Verification — you must BUILD this, it does not exist yet

Ticket 006 is a real deliverable, not a rubber stamp. The gate below proves the code
compiles; it proves **nothing** about whether the poster is legible at 390px, which is
the entire point of the work. So write a Playwright script that:

- walks the 11 widths in ticket 006 (1440 → 320),
- **drives the UI like a user** — click nav links, scroll, follow a route and come back —
  not merely reading computed styles. A component can pass lint, types and build and
  still throw on mount; only interaction finds that,
- **captures console and page errors during that interaction** and fails on them,
- asserts what a machine can decide: no horizontal overflow, a legibility floor, tap
  targets ≥ 44px, ParallaxHand present ≥768 and absent below,
- writes screenshots to `shots/` at each width, before and after interaction.

It must **exit non-zero on failure** so it can join the gate. Wire it as
`bun run verify`. Expect it to FAIL on the current code — that failure is the work.

Screenshots are evidence for a human, not proof. Say in `## Notes` what you expected to
change at each width and what the screenshot actually shows.

## Secrets / Network / Filesystem

- **Secrets:** none granted. Nothing in these tickets needs one.
- **Network:** allowed — `cdn.jsdelivr.net`, `cdn.playwright.dev`, `**.prss.microsoft.com`.
  **Denied — `github.com`.** Verified from inside: `Blocked by network policy`. You
  cannot push, and must not try.
- **Filesystem (declared, unenforced):** write under `src/`, `public/`, repo config, and
  `shots/`. Nothing outside this repo.

## Gate

```
bun install && bun run lint && bun run build
```

Currently GREEN — keep it that way. Once `bun run verify` exists, it joins the gate.

## Commit gate — all four, in order

1. Gate green (lint AND build).
2. Feature verified — for CSS/layout tickets that means `bun run verify` passing at the
   widths the ticket names, with screenshots captured and described in `## Notes`.
3. `/simplify` in a sub-agent.
4. Gate green again.

Then `status: done`, commit. Never push.

## Recovery (a `doing` ticket exists)

Read it in full including `## Notes`, run `git diff`, run the gate.

| Tree  | Gate | Likely               | Action                               |
| ----- | ---- | -------------------- | ------------------------------------ |
| clean | pass | finished, unmarked   | verify against acceptance, mark done |
| clean | fail | broke on the way out | fix the gate, then mark done         |
| dirty | pass | mid-flight, healthy  | read the diff, finish, mark done     |
| dirty | fail | mid-flight, broken   | read the notes, fix or redo          |

Cannot tell what was intended? Append to `## Notes`, set `status: blocked`, commit, exit.

## When something is not scoped here

Stop. Note it, set `status: blocked`, commit, exit. Never invent scope.
