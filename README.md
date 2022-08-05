# semantic-release-workspace-dependency

> [semantic-release](https://github.com/semantic-release/semantic-release) plugin to update version of workspace dependency.

| Step               | Description                            |
| ------------------ | -------------------------------------- |
| `verifyConditions` | Verify configuration                   |
| `prepare`          | Update version of workspace dependency |

## Install

```bash
npm i --save-dev semantic-release-workspace-dependency
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

Add `semantic-release-workspace-dependency` after `@semantic-release/npm` and `@semantic-release/git` plugins.

## Configuration

### Options

| Variable | Description                                       |
| -------- | ------------------------------------------------- |
| `prefix` | Version prefix, can be `^` (default), `~` or `''` |

### Examples

```json
{
  "plugins": [
    "@semantic-release/npm",
    "@semantic-release/git",
    ["semantic-release-workspace-dependency", { "prefix": "~" }]
  ]
}
```

## License

[MIT License](https://opensource.org/licenses/MIT) (c) 2022
