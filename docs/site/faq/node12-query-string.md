# How to fix `query-string` syntax errors when compiling in Node 12?

Typical error example:

```javascript
Failed to compile.

./node_modules/antd-restful/node_modules/query-string/base.js
Module parse failed: Unexpected token
...
url: getUrlWithoutQuery(url_ ?? ''),
```

## Cause

- The installed `query-string` version includes newer syntax (such as `??` / `?.`).
- Node 12 or older build pipelines do not fully support this syntax, causing compile-time errors.

## Solution (Recommended)

Override the dependency in your consumer project via your package manager to force `antd-restful` to use `query-string@7.x`:

### npm (>= 8.3.0)

```json
{
  "overrides": {
    "antd-restful": {
      "query-string": "^7.1.3"
    }
  }
}
```

### npm 6 / 7 (via npm-force-resolutions)

`overrides` is supported starting from npm 8.3.0 (shipped with Node.js 16). If you use Node 12 (default npm 6), you can achieve a similar effect via [npm-force-resolutions](https://www.npmjs.com/package/npm-force-resolutions):

1. Install the tool and configure `package.json`:

```json
{
  "resolutions": {
    "query-string": "^7.1.3"
  },
  "scripts": {
    "preinstall": "npx npm-force-resolutions"
  }
}
```

2. Run `npm install`; the `preinstall` hook will automatically rewrite the corresponding version in `package-lock.json`.

> **⚠ Note**: `npm-force-resolutions` requires reading `package-lock.json`. If you just deleted `package-lock.json` and run `npm install` directly, the `preinstall` hook runs first while the file does not yet exist, and will throw:
>
> ```
> ENOENT: no such file or directory, open './package-lock.json'
> ```
>
> **Workaround**: Generate the lock file first, then run a full install:
>
> ```bash
> npm install --ignore-scripts   # Skip hooks, only generate package-lock.json
> npm install                    # preinstall hook can now run normally
> ```

### pnpm

```json
{
  "pnpm": {
    "overrides": {
      "query-string": "^7.1.3"
    }
  }
}
```

### yarn

```json
{
  "resolutions": {
    "query-string": "^7.1.3"
  }
}
```

After configuring, reinstall dependencies and confirm the effective version via `npm ls query-string` (or `pnpm why query-string` / `yarn why query-string`).

> Note: If `query-string@9.x` was previously installed, delete `node_modules` and the lock file and reinstall for the override to take effect reliably.

## Alternative

If you must use `query-string@9`, ensure at least one of the following:

- Upgrade the runtime to Node 18+.
- Include `query-string` in the Babel transpilation scope in your consumer project's build config (e.g. transpile whitelisted packages in webpack).
