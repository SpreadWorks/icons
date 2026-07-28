---
name: senti.flow-direct
description: Inspect and continue an interrupted Spec-Driven Development flow through direct repair, verification, reconciliation, suspension, abort, and limited completion. Use when the user explicitly invokes direct Flow recovery or when a Flow command reports that normal progress cannot continue.
---

# Direct Flow Recovery

Use the CLI as the durable source of Flow state and safety checks. Treat the user's
explicit invocation of this skill as authorization to continue the current eligible
Flow through direct repair, current implementation completion, verification,
limited integration, completion recording, and managed cleanup. It is not
authorization to target a different Flow, accept failed tests, discard
unintegrated work, or override a target/evidence conflict.

## Choice Format

Use this format only for two or more materially different choices that require
new user authority. Never display a single operation as a choice, and never add
“inspect” or “keep the current state” merely to manufacture a second option.

Present real choices in the following format:
```
──────────────────────────────────────────────────────────
  Description (question or situation)
──────────────────────────────────────────────────────────

  [1] Label
  [2] Label
  [3] Other

```
- Do not combine the description and choices into one sentence. Description goes inside the lines, choices go outside.
- Add blank lines before and after the choices.

**MUST: ユーザーへの全ての質問は Choice Format で提示する。** ラベル + 1 行注釈の選択肢。詳細説明は選択肢ブロックの外（上側）に独立配置する。free-form question 禁止（applied user-requested changes の確認も含む）。

<!-- ai-question-style.md — shared style rules for AI-generated questions and choices -->

## AI Question / Choice Style Rules

These rules apply to every question and option block that the AI presents to the user.
The goal is to produce output that is consistent in granularity, tone, and structure
regardless of which model renders it.

### 1. 文体 (Prose Style)

- 結論先出し。前置き・総括文を省く。
- 一文を短く。修飾の入れ子を避ける。
- 体言止め・箇条書きで密度を上げる。
- 二重譲歩を畳む。
- 曖昧な修飾語を避ける: `strict`, `autonomous`, `low impact`, `backward-compatible`,
  `appropriate`, `fast`, `easy` など検証不能な語。検証可能な条件に書き換える。

**悪い例:**
> 既存機能への影響はおそらく低く、互換性を保てるような形で統合される可能性があります。

**良い例:**
> 既存機能への影響なし。R1 / R2 のみ追加。既存本文は変更しない。

### 2. 前提知識 (Assumed Knowledge)

- 専門用語を出したら 1-2 行で定義を添える。
- 読者が該当コードを開いていない前提で書く。
- 関数名・ファイル名・CLI だけ挙げず、何をするものか短く記す。

**悪い例:**
> buildGuardrailPrompt を差し替えて agent.call のコストを下げます。

**良い例:**
> `buildGuardrailPrompt` (= gate 評価 prompt を組み立てる関数) を置換。
> agent.call は Claude / codex CLI を外部 spawn する関数で、呼び出し 1 回が数秒コスト。

### 3. 選択肢提示 (Choice Presentation)

- 選択肢ブロック内は「ラベル」＋「1 行注釈」のみ。複数行の説明を詰めない。
- 比較・評価・pros/cons の詳細は、選択肢ブロックの外（上側の本文）に独立配置する。
- 推奨案があれば明示し、根拠を 1-2 行で添える。
- 推奨案がある場合、推奨案を `[1]` に配置する。同率トップ（僅差）が複数ある場合は 1 件を `[1]` に置き、残り候補は本文側で補足する。推奨案が無い場合は配置ルールを発動させない（並び順は自由）。
- 選択肢内に新規 API / ファイル / コマンドを挙げるときは、本文側で以下を 3-5 行示す:
  - 関数: シグネチャ例（引数型・戻り値型・呼び出し例）
  - CLI: 呼び出し例と出力 JSON 例
  - ファイル: 想定される中身のスケッチ

**悪い例（選択肢内に詳細を詰め込む）:**

```
  [1] 共通パーシャル化
      pros: DRY。編集が 1 箇所で済む。既存の include 基盤を流用できる。
            upgrade でユーザーに反映される。
      cons: get-step-instructions.js の改修が必要。既存パーサーを流用するので
            コスト小。
  [2] コピー埋め込み
      ...
```

**良い例（本文で比較、選択肢はラベル + 短注釈）:**

> 共通パーシャル化 vs コピー埋め込みの比較:
>
> | 方式 | 編集コスト | 同期リスク | 実装差分 |
> |---|---|---|---|
> | パーシャル | 1 箇所 | なし | ローダ改修あり |
> | コピー | 2 箇所 | あり | なし |

```
  [1] 共通パーシャル化（推奨）
  [2] コピー埋め込み
```

### 4. Turn Structure for User Decisions (Required)

Although these rules are written in English, perform reasoning AND user-facing output in the user's response language. The only tokens that may remain in the source language are: code identifiers (function/class/variable names, file paths, command names, CLI flags, error codes), library/package names, and proper product/brand names. Every other token MUST be translated into the response language.

A user decision exists only when at least two materially different executable
outcomes need new user authority. Do not present a choice block when:

- only one operation is available;
- the only alternatives are read-only inspection or keeping the current state;
- the user already asked to continue and the remaining path is a deterministic,
  non-destructive continuation;
- the operation merely reads state needed for the agent's next judgment.

Execute those mechanical operations directly. If they cannot make progress,
explain the concrete blocker without asking the user to approve an inspection.

Every turn that asks the user to choose between two or more real outcomes MUST contain all five sections below in order:

1. **Decision statement** (REQUIRED, 1 sentence): explicitly state what is being decided.
2. **Recommendation + rationale** (REQUIRED, 1-3 sentences): name the recommended option and give the reason. If no recommendation is possible, REQUIRED to explicitly state that no recommendation is possible, with the reason — do not skip this section.
3. **Comparison** (REQUIRED, one short paragraph or 2-4 bullets): how the recommended option differs from each alternative. This section is mandatory even when options are equivalent — in that case, state how they differ in trade-offs.
4. **Options block** (REQUIRED): list every option as "label — one-line note". Each option MUST appear. Mark the recommended one explicitly.
5. **Response instruction** (REQUIRED, 1 sentence): tell the user exactly what to type/say to advance.

ABSOLUTELY PROHIBITED:

- Skipping any of the 5 sections above.
- Producing a single-line response when a decision is being asked.
- Listing facts and asking "which one?" without providing the recommendation section.
- Leaving foreign-language tokens in prose that have natural equivalents in the response language.

All sections marked REQUIRED must appear regardless of whether the AI internally judges them necessary; the structure itself is the contract.

### MUST
**MUST: 議論の途中で「結論:」「決定:」と独断で締めてはならない。** 設計判断はユーザーが決定者である。AI は選択肢とトレードオフを示し、ユーザーの選択を待つ。

### Why
過去のセッションで、AI が議論を勝手に締めて方向性を確定させ、ユーザーが意図しない実装に進んだ事例が 8 件発生している。AI が議論をリードしすぎると、ユーザーの判断機会を奪う。

### How to apply
- このルールが表示されたフェーズでは、複数の選択肢があり得る論点を必ず Choice Format で提示する。
- 「結論:」「決定:」「方針が確定した」等の語で議論を締めない。「推奨:」「私の見解:」までに留める。
- ユーザーが明示的に選択肢を指定するまで、AI は最終決定を確定させない。

## Inspect the Exact Target

1. Bind the intended Flow using every known target field:
   - `--expect-run-id <runId>`
   - `--expect-issue <issue>` or `--expect-no-issue`
   - `--expect-spec <spec>`
2. Run `senti flow get direct` with those guards.
3. If the CLI reports a target mismatch, ambiguity, no Flow, or an unavailable
   managed worktree, stop without changing Flow or Git state. Explain the concrete
   mismatch in the user's language.

Never select a target from the current directory, branch name, parked pointer, or
an unguarded active-flow lookup.

## Follow Mechanical Continuations Without Asking

When guarded inspection returns `requiresUserAction: false` with a
`continuation`, execute its exact guarded `nextAction` immediately. Do not render
the continuation as a numbered choice.

If the result is `DIRECT_MODE_UNSUPPORTED` and the continuation returns to the
normal Flow, execute it and continue under the `senti.flow` dispatcher rules.
An unapproved spec or a Flow that has not reached implementation is still normal
Flow work; it is not a direct-recovery decision. The user's request to continue
the same Flow already rules out a passive “keep everything stopped” alternative.

For older CLI responses that still contain an `actionPrompt`:

- execute a sole read-only `INSPECT_*` choice once without asking;
- execute `CONTINUE_NORMAL_FLOW` without asking when every other choice only
  keeps or inspects unchanged state;
- if the identical inspection response recurs, explain the concrete blocker in
  the user's language and stop instead of asking the user to select inspection
  again.

Never show raw action IDs, transition names, impact arrays, commands, or English
CLI prose as the user-facing explanation. Keep them internal and explain actual
effects in the user's language.

## Enter Direct Repair Without an Entry Menu

When the user explicitly invokes this skill and the inspected result offers
`SELECT_DIRECT_FIX`:

1. Do not show the entry choices.
2. Execute the guarded `SELECT_DIRECT_FIX` action immediately. Do not add
   `--scope`; the CLI derives the initial repair scope from the current feature
   changes, worktree changes, and recorded findings.
3. Re-run the guarded `senti flow get direct`.
4. Continue only after the CLI has persisted the repair plan and reports the
   direct-fix phase.

The explicit skill invocation is the user's direct-repair choice. `autoApprove`
does not provide this authority, but no second confirmation is required from the
same user request.

Never auto-select `SELECT_DIRECT_RECONCILE` merely because ancestry exists while
unintegrated implementation changes remain. If the exact implementation is
already integrated and the CLI reports one unambiguous mechanical reconciliation
continuation for the bound target, continue it under this skill invocation.
Conflicting integration and worktree evidence remains a real decision.

## Resume Durable Completion Without a Menu

Prepared completion evidence and its matching teardown transaction take precedence
over a retained `SUSPENDED` or legacy `ABORTED` phase.

When guarded inspection reports `DIRECT_PREPARED_CLEANUP` or another single
deterministic `FINALIZE_DIRECT` continuation:

1. Do not present retry, suspend, abort, worktree-restoration, or inspection
   choices.
2. Execute the guarded continuation immediately. This resumes the existing
   idempotent completion transaction; it does not authorize or repeat a merge.
3. Re-run guarded inspection and continue any remaining mechanical cleanup phase.
4. Stop only on a concrete identity/evidence conflict, an unsafe unexpected file,
   or another real decision defined below.

Do not recreate a missing worktree binding merely to finish cleanup. The CLI must
use the persisted completion receipt and matching teardown transaction as the
authority for already-completed phases.

A pending integration receipt may name the feature commit that existed before a
later rebase. Do not treat that stale commit alone as an unrecoverable conflict
and do not ask the user to suspend, abort, or rebuild the session. Follow the
guarded mechanical continuation. The CLI owns refreshing the exact feature
target, invalidating only the unmerged pending receipt, rerunning the recorded
verification command, and resuming finalization. Stop only if that continuation
returns a concrete content, target-identity, or integration-evidence conflict.

## Reopen a Retained Abort Without an Entry Menu

When the user explicitly invokes this skill, no integration or prepared completion
evidence exists, and the inspected result offers `REOPEN_ABORTED_DIRECT`:

1. Do not present the retain/inspect menu.
2. Execute the guarded `REOPEN_ABORTED_DIRECT` action with a concise reason that
   states the user's request to continue the retained target.
3. Re-run the guarded `senti flow get direct`.
4. Continue only after the CLI archives the prior abort receipt, refreshes the
   exact Git safety baseline, resets the bounded verification attempt budget,
   and reports the direct-fix phase.

The explicit skill invocation authorizes reopening the same retained target. It
does not authorize changing target identity, accepting failed tests, discarding
the prior abort receipt, or bypassing the normal verification and limited
finalization checks.

## Continue Known Mechanical Actions

Do not ask the user to supply information already recorded by the Flow or project:

- Repair scope comes from the persisted direct plan. Ask for paths only when the
  CLI reports a concrete out-of-scope conflict that cannot be resolved from the
  changed files and findings.
- Verification command comes from the previous direct verification,
  `final-regression-result.json`, a single command in
  `test-execute-result.json`, or the project test configuration. Execute the
  CLI-provided verification action without asking the user to repeat it.
- Exact target guards come from the inspected Flow state. Preserve them on every
  command.

Automatically execute safe, deterministic continuation actions when their inputs
are complete, including repair-plan preflight, verification after current
implementation proof, limited finalization after passed verification, durable
cleanup continuation, and guarded readback.

Only edit source, tests, spec files, or issue-log entries after the CLI has
persisted the direct plan and entered direct fix. Stay inside the persisted scope.
Record newly discovered findings through the CLI action before expanding the plan.

## Complete the Implementation Before Verification

`DIRECT_IMPLEMENTATION_REQUIRED` is a work instruction for the agent, not a user
decision and not permission to run tests immediately.

1. Read the spec goal, every requirement, task status, current diff, and the
   affected product code in the retained worktree.
2. Continue the implementation until the whole requested behavior is present.
   A previous passing test result, `done` requirement metadata, or an existing
   verification command is not evidence that implementation work is complete.
3. Inspect the final diff against every requirement. Do not infer completeness
   merely because the bounded tests pass.
4. Only then execute the guarded `CONFIRM_DIRECT_IMPLEMENTATION` action. Supply
   `--summary` with concrete requirement-by-requirement evidence, naming every
   requirement ID returned by the CLI and the implemented product behavior.
5. Re-run guarded inspection. Run `VERIFY_DIRECT` only when the CLI reports that
   the implementation proof matches the exact current change set.

Returning to direct fix, reopening an abort, recording a new finding, or changing
any implementation file invalidates the proof. Re-inspect the implementation and
record a new proof before verification. If verification fails, explain the
failing check in plain language, continue the bounded repair, re-record
implementation completion, and re-run verification within the CLI attempt limit.

## Ask Only for a Real Decision

Ask the user only when direct repair cannot proceed safely without new authority,
for example:

- the target is ambiguous or differs from the requested run/Issue/spec;
- a recorded product decision has no safe deterministic resolution;
- integration evidence conflicts with uncommitted implementation changes;
- passing requires explicit acceptance of test risk;
- the requested next step would affect a different target, discard unintegrated
  work, accept failed verification, or resolve conflicting integration evidence;
- no unique verification command can be derived from Flow artifacts or project
  configuration.

For such a decision:

1. Explain the situation without internal state-machine names. Define any
   unavoidable technical term in one short sentence.
2. Explain what each option keeps, changes, or deletes in ordinary language.
3. Present every viable option in the standard numbered Choice Format, translated
   into the user's language. Put the recommendation at `[1]`.
4. Keep CLI action IDs, raw transition names, plan class names, receipt class
   names, and exact commands internal unless the user asks for diagnostics.
5. Map the user's number or label to the exact current CLI action, execute it, and
   immediately perform guarded readback. Never reuse a stale prompt.

Do not ask a free-form question and do not present raw `actionPrompt` JSON as the
user explanation.

## Completion Boundary

Use only the limited direct finalization or reconciliation action returned by the
CLI. Do not run normal review, gate, retro, report, final-regression, or
documentation synchronization as substitutes.

Continue the guarded inspect → mechanical action → guarded readback loop until:

- direct completion succeeds: report the completion result, merge disposition,
  cleanup result, and external-hook warnings in plain language;
- direct handling is aborted: report what was retained;
- a real decision described above is required: present the numbered choice and
  wait;
- the target is unsupported, mismatched, ambiguous, or corrupt: stop without
  mutation and state the exact recovery requirement.

Do not run integration-specific issue or board commands from this skill.
Completion hooks consume the receipt's idempotency metadata.
