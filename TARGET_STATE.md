# Target-state landing copy (HELD)

**This branch (`feat/target-state-copy`) rewrites the landing surfaces to describe
OpenAdapt AS IT WILL BE when the currently-in-flight platform work lands, NOT as it
is today.** It is a specification for the marketing surface, held until the product
actually reaches this state.

**DO NOT publish or merge this branch until the product ships the capabilities it
describes.** Merging it early would put claims on the public site that are not yet
true. The gap list (what this copy claims that is not true yet) lives in the PR
description and drives the remaining implementation.

Grounded in `.private/DESIGN_hosted_matrix_2026_07_14.md` (the deployment × substrate
matrix) and the July-13 honesty ethos (`project_critical_review_reality_check`).

What the target state adds over today's live copy:

- **One substrate-agnostic runner** covering **web AND Windows desktop / Citrix-RDP**
  (today the desktop/VDI adapters are "in progress").
- **A deployment-choice spectrum** instead of a blanket "on your premises" claim:
  our cloud (non-PHI), BYOC / your-VPC (regulated, PHI), and self-hosted / on-prem
  (air-gapped). Data-residency claims are scoped **per tier**, never company-wide.
- **Fail-closed regulated execution** (`openadapt-flow run` refuses unless certified,
  identity-covered, effect-declared, signed/encrypted, and version-pinned).
- **Halt -> teach -> promote** as a shipped loop (teach the fix once, promote it
  through governed review), not just "it halts."

Honesty rules kept intact: no invented benchmarks (only the real OpenEMR 20/20 vs
10/10 and MockMed results with their existing caveats), effect verification is
described as on-screen read-back (not independent verification), identity/effect
scoping stays honest, and there are no em-dashes.
