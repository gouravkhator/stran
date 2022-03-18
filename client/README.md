# Stran - Frontend with Preact

## CLI Commands
*   `npm install`: Installs dependencies

*   `npm run dev`: Run a development, HMR server

*   `npm run build`: Production-ready build

*   `npm run serve`: Run the build script and then run a production-like server

*   `npm run lint`: Pass TypeScript files using ESLint

*   `npm run test`: Run Jest and Enzyme with [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

## Resolving older Issues with PreactJS:

| ISSUES | Solved Status | Resolution Tries |
| --- | --- | --- |
| process.env is empty | NOT SOLVED | Tried dotenv loading in preact.config.js file, but no luck. 
| Using peerjs dependency led to breaking of `npm run build` script | Temporary solution | Using `preact build --no-prerender` did work.
| Process is not defined | SOLVED | [Stack Overflow solution](https://stackoverflow.com/questions/70368760/react-uncaught-referenceerror-process-is-not-defined). Added config.node.process = true; in `preact.config.js` file. |
| Cannot convert bigint to number | SOLVED | Added browserslist with proper supported browsers version in package.json
| Nullish Coalescing operator not working | NOT SOLVED | For Nullish coalescing operator, the issue shows "You need additional loaders for handling the result of these"

### Issues more details:

* 'electron' not resolved:
  ```bash
  preact build

  ✖ ERROR ../node_modules/electron-fetch/lib/index.es.js
  Module not found: Error: Can't resolve 'electron' in './node_modules/electron-fetch/lib'
  @ ../node_modules/electron-fetch/lib/index.es.js 1271:13-32
  @ ../node_modules/ipfs-utils/src/fetch.js
  @ ../node_modules/ipfs-utils/src/http/fetch.browser.js
  @ ../node_modules/ipfs-utils/src/http/fetch.js
  @ ../node_modules/ipfs-utils/src/http.js
  @ ../node_modules/ipfs-utils/src/files/url-source.js
  @ ../node_modules/ipfs-core/cjs/src/index.js
  @ ./utils/ipfs.util.ts
  @ ./routes/home/index.tsx
  @ ./components/app.tsx
  @ ./index.ts
  ``` 

*  Cannot convert bigint to number:

    Add below in package.json:

    ```json
    "browserslist": {
        "production": [
          "chrome >= 67",
          "edge >= 79",
          "firefox >= 68",
          "opera >= 54",
          "safari >= 14"
        ],
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      }
    ```

* Nullish coalescing operator not working
  
  One resolution given in stackoverflow, which didn't work for me:

  [Changed target: esnext to es2018 in tsconfig.json file](https://stackoverflow.com/questions/58813176/webpack-cant-compile-ts-3-7-optional-chaining-nullish-coalescing).

  Webpack issue for reference : https://github.com/webpack/webpack/issues/10227

  Originally the fields in tsconfig.json was: "target": "ES5", "module": "ESNext"
