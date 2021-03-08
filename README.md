# Auto-merge dependency update action

A GitHub action that will enable [auto-merge for a PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/automatically-merging-a-pull-request) that only contains dependency updates, based on some rules.

Before you can use this action, [auto-merge must be enabled for the repository](https://docs.github.com/en/github/administering-a-repository/managing-auto-merge-for-pull-requests-in-your-repository) and you have to configure [branch protection rules](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule), such as passing status checks.

Note that the action does not check the lockfile is valid, so you should only set `allowed-actors` you trust, or validate that the lockfile is correct in another required action.

The action currently supports npm and yarn.

## Config

- `github-token`: A GitHub personal access token with `repo` access. The default `GITHUB_TOKEN` secret can't be used.
- `allowed-actors` (optional): A comma-separated list of usernames auto-merge is allowed for. _Default: `dependabot-preview[bot], dependabot[bot]`
- `allowed-update-types` (optional): A comma-separated list of types of updates that are allowed. Supported: [devDependencies|dependencies]:[major|minor|patch]. _Default: `devDependencies:minor, devDependencies:patch`_
- `approve` (optional): Automatically approve the PR if it qualifies for auto-merge. _Default: `true`_
- `package-block-list` (optional): A comma-separated list of packages that auto-merge should not be allowed for.

You should configure this action to run on the `pull_request` or `pull_request_target` event.

## Example Action

```yaml
name: Auto Merge Dependency Updates

on:
  - pull_request_target

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: tjenkinson/auto-merge-dependency-update-action@v1
        with:
          github-token: ${{secrets.REPO_PAT}}
```
