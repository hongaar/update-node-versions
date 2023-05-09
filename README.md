# update-node-versions ![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/hongaar/update-node-versions?label=latest%20version&sort=semver)

**A GitHub Action to automatically update you repository to the latest Node.js
versions. Supports updating GitHub workflows, package.json `engines` and
arbitrary files.**

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Versions](#versions)
- [Updaters](#updaters)
- [Inputs](#inputs)
- [Outputs](#outputs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

This example workflow will check for new Node versions every Sunday at 7:30 AM.
If a new version is found, versions are updated, the changes will be
automatically committed to a new branch and a pull request created.

```yaml
# .github/workflows/update-node-versions.yml
name: update-node-versions

on:
  schedule:
    - cron: "30 7 * * 0"

jobs:
  update-node-versions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hongaar/update-node-versions@v2
      - uses: peter-evans/create-pull-request@v5
        with:
          title: "feat: update node.js versions"
          body: |
            Automated changes by [update-node-versions](https://github.com/hongaar/update-node-versions) GitHub action

            BREAKING CHANGE: This updates the supported node.js versions
          token: ${{ secrets.GH_PAT }}
```

> **Note**: If you're using `updaters.workflows` (enabled by default), the
> `peter-evans/create-pull-request` action needs a Personal Access Token with
> write access to 'pull requests' and 'workflows' (fine-grained tokens) or
> 'repo'/'public_repo' and 'workflow' scopes (classic token). The default
> `secrets.GITHUB_TOKEN` does not have the required permissions.

## Versions

By default, versions will be updated to reflect the 'current' and 'LTS' versions
of Node which are not end-of-life.

Optionally, you can configure the action to use another strategy for selecting
Node versions.

## Updaters

You can configure which parts of your repository are updated. By default, the
**GitHub workflows** and **Engines** updaters are enabled. These updaters are
available:

- **GitHub workflows**  
  This will scan all your GitHub workflows for a `node-version` variable in a
  matrix strategy and update them accordingly. The name of the variable can be
  configured.
  ```yaml
  strategy:
    matrix:
      node-version: [14, 16, 18]
  ```
- **Engines**  
  This will update the `engines` field in your `package.json` file. It will use
  the lowest Node version as the minimal supported version.
  ```json
  {
    "engines": {
      "node": ">=14"
    }
  }
  ```
- **Files**  
  This will update arbitrary files in your repository. You can specify a glob
  pattern of files to update, a regex to match and a replacement template to
  replace the matches with. Files in `node_modules` are ignored. You can use
  these tags in the template:

  | tag              | output example |
  | ---------------- | -------------- |
  | `$1`, `$2`, etc. | Match group    |
  | `${versions}`    | `14, 16, 18`   |
  | `${minVersion}`  | `14`           |
  | `${maxVersion}`  | `20`           |

  > **Note**: You can specify a list of glob patterns by specifying each pattern
  > on a new line. If you also provide a list regexes and templates, each glob
  > pattern will use the respective line in the regex and template inputs.

## Inputs

| name                          | default                                         | description                                                                                                                                                  |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `versions`                    | <pre>latest<br/>lts<br/>lts/-1<br/>lts/-2</pre> | Node versions to select, should be resolvable by [node-version-alias](https://www.npmjs.com/package/node-version-alias). Specify each version on a new line. |
| `versions.filter-eol`         | `true`                                          | Filter out Node versions which are end-of-life. [Source](https://github.com/nodejs/Release/blob/main/schedule.json) used for filtering.                      |
| `updaters.workflows`          | `true`                                          | Update GitHub workflows.                                                                                                                                     |
| `updaters.workflows.variable` | `"node-version"`                                | Use this name as the matrix strategy variable to update the Node versions in.                                                                                |
| `updaters.engines`            | `true`                                          | Update package.json `engines`.                                                                                                                               |
| `updaters.files`              | `false`                                         | Update arbitrary files.                                                                                                                                      |
| `updaters.files.glob`         |                                                 | Glob pattern for files to update.                                                                                                                            |
| `updaters.files.regex`        |                                                 | Matches will be replaced with the template.                                                                                                                  |
| `updaters.files.template`     |                                                 | Replace matches with this template.                                                                                                                          |

All inputs are optional. Example:

```yaml
- uses: hongaar/update-node-versions@v1
  with:
    versions: |
      current
      lts
      lts/-1
      lts/-2
    versions.filter-eol: true
    updaters.workflows: true
    updaters.workflows.variable: node
    updaters.engines: false
```

## Outputs

| name       | description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| `versions` | The Node versions to update to as stringified JSON array (e.g. `"[14, 16, 18]"`) |
