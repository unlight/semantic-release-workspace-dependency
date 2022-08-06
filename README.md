# semantic-release-workspace-dependency

Plugin for [semantic-release](https://github.com/semantic-release/semantic-release) to update version of workspace dependency.

| Step               | Description                            |
| ------------------ | -------------------------------------- |
| `verifyConditions` | Verify configuration                   |
| `prepare`          | Update version of workspace dependency |

## Install

```bash
npm i -D semantic-release-workspace-dependency
```

## Usage / How it works

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

Add `semantic-release-workspace-dependency` after `@semantic-release/npm` and `@semantic-release/git` plugins.

Plugin is supposed to be used in repository with multiple packages (monorepository strategy)
with `semantic-release-commit-filter`.

Let's say that we have workspace:

- package `foo`
- package `bar` depends on `foo`

Package `bar` has depenency defined in package as `foo:*`.

Your must run `build` and `semantic-release` for each package using your monorepo tool (nx, wireit, etc.)
which can detect the correct order of execution.

When package `bar` is going to be published on `prepare` step it replace `*` by latest verion of `foo` package.
Version will be taken for git tags. `*` can be any valid semver range, e.g. `1.X`

## Configuration

### Options

| Variable | Description                                       |
| -------- | ------------------------------------------------- |
| `prefix` | Version prefix, can be `^` (default), `~` or `''` |

### Examples

```json
{
  "extends": ["semantic-release-commit-filter"],
  "plugins": [
    "@semantic-release/npm",
    "@semantic-release/git",
    ["semantic-release-workspace-dependency", { "prefix": "^" }]
  ]
}
```

## License

[MIT License](https://opensource.org/licenses/MIT) (c) 2022
