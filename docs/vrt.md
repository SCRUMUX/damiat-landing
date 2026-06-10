# Visual Regression Testing (VRT)

AICADS treats every Storybook story as a visual contract. Phase 10 task 10.9
introduced a CI-gated VRT pipeline so any unintended visual change to a
primitive blocks the PR until a human approves it in Chromatic.

## Stack

| Layer            | Tool                                                            |
| ---------------- | --------------------------------------------------------------- |
| Story renderer   | `@storybook/react-vite` (Storybook 8)                            |
| Local snapshots  | `@storybook/test-runner` + `playwright`                          |
| Cloud baseline   | [Chromatic](https://www.chromatic.com)                           |
| CI               | [`.github/workflows/chromatic.yml`](../.github/workflows/chromatic.yml) |
| Config           | [`.chromatic.config.json`](../.chromatic.config.json)            |
| Threshold        | `0.002` (= 0.2% pixel diff per snapshot)                          |

## Local workflow

```bash
# 1. Start Storybook on :6006
cd playground
npm run storybook

# 2. In another shell, run the test-runner against the running instance
npm run test-storybook
```

## Pushing baselines to Chromatic

1. Put your `CHROMATIC_PROJECT_TOKEN` in repository secrets.
2. Replace `PUT-CHROMATIC-PROJECT-ID-HERE` in `.chromatic.config.json` with
   the Chromatic project id.
3. From `playground/`, run `npm run chromatic`.

The Chromatic workflow runs on every push to `main` and on every PR.

## Gating policy

- New stories add new baselines; CI passes once baselines exist.
- Changed pixels in any story block the PR until manually approved in
  Chromatic.
- `diffThreshold` is intentionally tight (0.2%) to surface
  anti-aliasing-class regressions in token-driven UI.
