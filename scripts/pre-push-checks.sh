#!/usr/bin/env bash

set -euo pipefail

echo "Running pre-push checks on committed changes..."

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ "${CURRENT_BRANCH}" == "main" || "${CURRENT_BRANCH}" == "master" ]]; then
  echo "Strict pre-push mode for ${CURRENT_BRANCH}: running full lint + test suite..."
  npm run lint
  npm run test
  echo "Strict pre-push checks passed."
  exit 0
fi

if git rev-parse --verify --quiet "@{upstream}" >/dev/null; then
  BASE_COMMIT="$(git merge-base HEAD "@{upstream}")"
elif git rev-parse --verify --quiet "origin/main" >/dev/null; then
  BASE_COMMIT="$(git merge-base HEAD "origin/main")"
elif git rev-parse --verify --quiet "origin/master" >/dev/null; then
  BASE_COMMIT="$(git merge-base HEAD "origin/master")"
else
  BASE_COMMIT="$(git rev-list --max-parents=0 HEAD --reverse | sed -n '1p')"
fi

CHANGED_FILES="$(git diff --name-only --diff-filter=ACMR "${BASE_COMMIT}...HEAD")"

if [[ -z "${CHANGED_FILES}" ]]; then
  echo "No committed file changes detected for push range."
  exit 0
fi

mapfile -t LINT_FILES < <(
  printf '%s\n' "${CHANGED_FILES}" \
    | rg '^(app|components|data|hooks|lib)/.*\.(ts|tsx|js|jsx)$' || true
)

if ((${#LINT_FILES[@]} > 0)); then
  echo "Linting changed files..."
  npx eslint "${LINT_FILES[@]}"
else
  echo "No changed lint-target files found."
fi

mapfile -t DIRECT_TEST_FILES < <(
  printf '%s\n' "${CHANGED_FILES}" \
    | rg '\.test\.(ts|tsx|js|jsx)$' || true
)

if ((${#DIRECT_TEST_FILES[@]} > 0)); then
  echo "Running changed test files..."
  npx vitest run --passWithNoTests "${DIRECT_TEST_FILES[@]}"
else
  echo "No changed test files found."
fi

mapfile -t SOURCE_FILES < <(
  printf '%s\n' "${CHANGED_FILES}" \
    | rg '\.(ts|tsx|js|jsx)$' \
    | rg -v '\.test\.(ts|tsx|js|jsx)$' || true
)

if ((${#SOURCE_FILES[@]} > 0)); then
  echo "Running related tests for changed source files..."
  npx vitest related --run --passWithNoTests "${SOURCE_FILES[@]}"
else
  echo "No changed source files found for related tests."
fi

# Typecheck the whole project when any .ts/.tsx file changed. Cheap (tsc is
# already incremental via tsbuildinfo) and catches cross-file type breakage
# that vitest related can't see.
mapfile -t TS_FILES < <(
  printf '%s\n' "${CHANGED_FILES}" \
    | rg '\.(ts|tsx)$' || true
)

if ((${#TS_FILES[@]} > 0)); then
  echo "Running typecheck..."
  npm run typecheck
else
  echo "No changed TypeScript files; skipping typecheck."
fi

echo "Pre-push checks passed."
