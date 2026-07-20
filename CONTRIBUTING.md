# Contributing

Thanks for contributing to OpenAdapt. A few things keep the project healthy and
keep the company able to steward it.

## Licensing of your contributions

This repository's code is MIT-licensed. So that OpenAdapt (MLDSAI Inc.) can
continue to steward and, if ever necessary, relicense the combined work, every
contribution must be covered by BOTH of the following:

1. **Developer Certificate of Origin (DCO) sign-off (required now).** Add a
   `Signed-off-by` line to every commit certifying you wrote the change or have
   the right to submit it under the project license:

   ```
   git commit -s -m "fix: ..."
   ```

   This produces `Signed-off-by: Your Name <you@example.com>`. See
   https://developercertificate.org for the full DCO text.

2. **Contributor License Agreement (CLA).** By opening a pull request you agree
   to the OpenAdapt Contributor License Agreement. The canonical CLA text lives
   at [`openadapt-flow/CLA.md`](https://github.com/OpenAdaptAI/openadapt-flow/blob/main/CLA.md).
   When the CLA Assistant check is enabled on this repository, first-time
   contributors sign it once by commenting on their PR.

## Pull request guidelines

- Use **Conventional Commits** for titles and commits (`feat:`, `fix:`,
  `docs:`, `chore:`, `refactor:`, `test:`, `ci:`).
- Keep PRs focused; separate mechanical changes from behavior changes.
- Add or update tests for any behavior change.
- Prefer honest, measured claims in docs. If something is experimental, say so.

## Source-availability boundary

OpenAdapt is open-core. Do not add private crown-jewel artifacts (grown
hardening corpus, tuned adversary params, deployment-derived thresholds,
per-system-of-record oracle/connector recipes, real-EMR datasets) to this public
repository. Interfaces and mechanisms are public; data, recipes, and empirical
tuning are private. See the OpenAdapt Source-Availability Boundary policy.

## Reporting security issues

Do not file security problems as public issues; see `SECURITY.md` if present, or
email security@openadapt.ai.
