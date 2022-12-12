<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with
[DocToc](https://github.com/thlorenz/doctoc)_

- [update-node-versions action](#update-node-versions-action)
  - [Usage](#usage)
  - [Inputs](#inputs)
  - [Inputs](#inputs-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# update-node-versions action

Description of update-node-versions action

## Usage

```yaml
- uses: update-node-versions@v1
  with:
    gh-token: ${{ secrets.GH_PAT }}
```

## Inputs

| name       | required | default        | description                                     |
| ---------- | -------- | -------------- | ----------------------------------------------- |
| `gh-token` |          | `github.token` | GitHub token with read access to the repository |

## Inputs

| name     | description                  |
| -------- | ---------------------------- |
| `result` | Some result from this action |
