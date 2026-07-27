# 000 — Branch setup

**Branch:** both · **Depends on:** — · **Blocks:** all

## Context

This repo uses **GitButler**, not vanilla git. Two independent workstreams need two virtual
branches so the work stays separable.

See [AGENTS.md](../../AGENTS.md) for the full `but` CLI reference.

## Tasks

- [ ] Run `but skill` — built-in tips and tricks. Also use the `gitbutler` agent skill.
- [ ] `but status` — confirm workspace state and which branches are currently applied.
- [ ] `but branch list scroll` — check whether a scroll branch **already exists** (one was
      mentioned in planning). Reuse it; do not create a duplicate.
- [ ] `but branch new fluid-responsive-portfolio`
- [ ] `but branch new scroll-experiments`
- [ ] `but oplog snapshot -m "before fluid responsive work"` — safety net before any deletions.

## ⚠️ Committing with two branches applied

GitButler applies **multiple virtual branches simultaneously** to one working directory. A bare
`but commit` may sweep changes into the wrong branch — silently defeating the point of splitting
these workstreams.

**Always name the target branch:**

```bash
but commit fluid-responsive-portfolio -m "..."
but commit scroll-experiments -m "..."
```

Or assign up front with `but mark [branch]`. Verify with `but status` before every commit.

**Recovery:** `but undo`, or `but oplog restore [snapshot-id]`.

## Never use

`git commit`, `git checkout`, `git branch`, `git push` — vanilla git does not understand virtual
branches and will corrupt the workspace.

## Acceptance criteria

- Both virtual branches exist and are listed by `but branch`.
- No duplicate/orphan scroll branch.
- An oplog snapshot exists to roll back to.
- Working tree clean before any ticket work starts.
