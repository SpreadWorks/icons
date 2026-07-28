---
name: senti.workflow
description: Manage GitHub Projects board drafts and publish them as issues via the senti workflow command.
---

# Workflow Board

Use `senti workflow <subcommand> [args]` for board draft operations.

Supported subcommands:

- `add <title> [--category RESEARCH|BUG|ENHANCE|OTHER] [--body <text> | --body-file <path>]`
- `update <hash> [--status <status>] [--title <text>] [--body <text> | --body-file <path>]`
- `show <hash>`
- `search <query>`
- `list [--status <status>]`
- `publish <hash> [--label <label>]`
- `refine <hash>`
- `retro <specid>`
- `retro <specid> --add <numbers>`

Use `retro <specid>` to extract follow-up candidates from the spec's
issue-log/report sources into `ideas.json`. Existing `ideas.json` is treated as
the cache and is displayed without re-reading source artifacts or calling the
agent. Use `retro <specid> --add <numbers>` to add selected numbered candidates
to the workflow board.

Each `ideas.json` candidate includes the legacy board draft fields
`title`, `body`, `labels`, and `rationale`, plus the actionability fields
`phenomenon`, `problem`, `proposal`, `targetPaths`, `evidence`, `scope`, and
`verification`. `targetPaths` contains Git-managed repository-relative paths,
`evidence` points to issue-log/report source records, `verification` lists
commands or checks for the proposed fix, and `scope` is one of `in-project`,
`external`, or `unclear`.

`retro <specid>` only returns normal `candidates` when `scope = in-project`
and at least one tracked code-eligible `targetPaths` entry exists. Code-eligible
paths are `lib/`, `commands/`, `hooks/`, root `plugin.json`,
`config.defaults.json`, and `config.schema.json`. Candidates that only target
`docs/`, `skills/`, `.agents/`, `.claude/`, or `specs/` are returned in
`filtered` with reason `non-code-target`.

`retro <specid> --add <numbers>` uses the same eligibility predicate as display
and only adds eligible candidates to the workflow board. Candidates with
scope mismatch, empty `targetPaths`, unsafe paths, untracked paths,
`non-code-target`, or too many `targetPaths` are returned in the structured
`skipped` list with their number, title, reason, and targetPaths.

Legacy cache candidates without new fields normalize to empty
`phenomenon` / `problem` / `proposal`, empty `targetPaths` / `evidence` /
`verification`, and `scope = unclear`; without a tracked code-eligible path
they are excluded from normal display and skipped by `--add`.

Draft titles and non-empty draft bodies are written in the source language configured at `plugin.config.workflow.languages.source`, falling back to the project language.

Use `--body-file <path>` when the body is long Markdown or contains code
blocks, backticks, or shell-sensitive text. The path is resolved from the
current working directory. `--body` and `--body-file` cannot be used together.

```bash
senti workflow add "タイトル" --category BUG --body-file .tmp/workflow-body.md
senti workflow update abcd --body-file .tmp/workflow-body.md
```

When publishing an item, use `publish <hash>`. The plugin handles translation according to `plugin.config.workflow.languages.publish` and the configured workflow agent overrides.

Board classification is stored in GitHub Projects custom fields, not in title
prefixes. Category values map to automatic issue labels as follows:

- bug -> bug
- enhancement -> enhancement
- research -> research
- other -> other

`publish <hash>` applies the Category-derived label automatically. `--label` is additional and is merged with the automatic label. If Category is empty, legacy title prefixes remain publish-time fallback input: `[BUG]`, `[ENHANCE]`, `[RESEARCH]`, and `[OTHER]`.

Use `refine <hash>` before publishing when a board draft needs automated
preflight review. When the refine agent returns `ready`, the command updates
the draft issue body only. When the agent returns `needs-input`, the command
reports questions and does not update the board item. `refine <hash>` does not
publish issues and does not start flow; run `publish <hash>` or the Spec-Driven
Development flow separately after the draft is ready.

When Codex receives a `needs-input` result from `refine <hash>`, keep the CLI
structured result contract unchanged, but convert it into this Codex-side
interaction. Do not present the full questions array as the final answer.

1. `confirm-start`: use Choice Format to ask whether the user wants to answer
   now or stop. The choices must include an answer now / 回答する option and a
   stop / 回答しない option.
2. stop path: if the user chooses stop, leave the board item body unchanged.
   You must not run `senti workflow update`; must not run `senti workflow publish`;
   and must not run `senti flow` for that item.
   Report that `flowReady` remains false.
3. `ask-batch`: if the user chooses to answer, ask at most 3 questions from
   the current `questions` array in one turn. Prefer 1 question unless related
   questions share the same decision.
4. `apply-answer`: before composing the replacement body, run
   `senti workflow show <hash>` and use its current body as the source. preserve
   existing body content, incorporate the collected answers in the configured
   source-language style, then run `senti workflow update <hash> --body <text>`.
5. `rerun-refine`: only after the update succeeds, run
   `senti workflow refine <hash>` again. If update fails or returns an error,
   stop and report the error instead of rerunning refine.
6. `ready-or-stop`: inspect `status`, `updated`, `hasQuestions`, `questions`,
   and `flowReady`. Report ordinary ready only when `status` is `ready`,
   `updated` is true, `hasQuestions` is false, and `flowReady` is true. If
   `status` is `ready` but `updated` is false or `hasQuestions` is true, report
   a non-updated manual-action stop rather than ready.

Use the Readiness field for board triage state such as `ready`, `needs-goal`,
`needs-scope`, `needs-acceptance`, and `needs-investigation`.
