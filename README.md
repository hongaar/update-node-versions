# update-node-versions ![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/hongaar/update-node-versions?label=latest%20version&sort=semver)

**A GitHub Action to automatically update you repository to the latest Node
versions. Currently supports updating GitHub workflows and package.json
`engines`.**

🚧 In development

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
      - uses: hongaar/update-node-versions@v1
      - uses: peter-evans/create-pull-request@v4
```

## Versions

By default, versions will be updated to reflect the 'even' versions of Node
which are not end-of-life. This means that versions that will not be promoted to
LTS are ignored.

Optionally, you can configure the action to use another strategy for selecting
Node versions.

## Updaters

You can configure which parts of your repository are updated. By default, all
updaters are enabled. These updaters are available:

- **GitHub workflows**  
  This will scan all your GitHub workflows for a `node-version` variable in a
  matrix strategy and update them accordingly. The name of the variable can be
  configured.
  ```yaml
  strategy:
    matrix:
      node-version: [14, 16, 18]
  ```
- **package.json**  
  This will update the `engines` field in your `package.json` file. It will use
  the lowest Node version as the minimal supported version.
  ```json
  {
    "engines": {
      "node": ">=14"
    }
  }
  ```

## Inputs

| name                          | required | default                              | description                                                                                                                                                  |
| ----------------------------- | -------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `versions`                    |          | <pre>lts<br/>lts/-1<br/>lts/-2</pre> | Node versions to select, should be resolvable by [node-version-alias](https://www.npmjs.com/package/node-version-alias). Specify each version on a new line. |
| `versions.filter-eol`         |          | `true`                               | Filter out Node versions which are end-of-life. [Source](https://github.com/nodejs/Release/blob/main/schedule.json) used for filtering.                      |
| `updaters.workflows`          |          | `true`                               | Update GitHub workflows.                                                                                                                                     |
| `updaters.workflows.variable` |          | `"node-version"`                     | Use this name as the matrix strategy variable to update the Node versions in.                                                                                |
| `updaters.engines`            |          | `true`                               | Update package.json `engines`.                                                                                                                               |

Example:

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
