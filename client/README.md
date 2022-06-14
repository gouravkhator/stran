# Stran - Frontend with Preact

## NPM Scripts
*   `npm install`: Installs dependencies

*   `npm run dev`: Run a development, HMR server

*   `npm run build`: Production-ready build

*   `npm run serve`: Run the build script and then run a production-like server

*   `npm run lint`: Pass TypeScript files using ESLint

*   `npm run test`: Run Jest and Enzyme with [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

## Client-side Error Handling

- As we have multiple parts of the client side where we can get the error, so we don't user default Error object, rather we throw an object with below structure:

  ```js
  throw {
    errorMsg: 'Long descriptive error message for user',
    shortErr: 'short-error-message-in-hyphenated-format',
  }
  ```

- `errorMsg` is our custom error field, and if that is not thrown in our custom code, then we show user some specific message like `"Cannot process this request.."`

- **Why 2 fields for Error Messages ?**
  - Long error messages are for users to see.
  - Short error messages are kept, so that we can use this hyphenated short error strings in switch case statements in the catch blocks, to have conditional logic for each of those short errors.

## PeerJS API Structure and Usage

### States and their functionalities:

* `currCall` Object: It is the call object, that is the incoming or outgoing call.
  * `currCall.peer` Property: It represents the peerid of the remote peer, who is in current call.
  * `currCall.connectionId` Property: It represents the current call unique id.
  * `currCall` Object is set as mentioned below on both the caller and callee sides:
    1. Set on the side of caller A, when A calls another person B,
    2. Set on the side of callee B, when B monitors the incoming call, which is now of caller A.
* `isAnswering` state: It is set on the callee side, when the callee user clicks on Answer button, to answer the incoming call.
* `isCallee` and `isCaller` states:
  * both isCallee and isCaller cannot be true at the same time,
  * but both can be false at the same time denoting that there is no call now..
  * isCaller is set on the caller side, when that user initiates the call.
  * isCallee is set on the callee side, when that user monitors the incoming call.

### Algorithmic Flow of the PeerJS Connections and state changes

TODO

### Extra Notes for PeerJS

* To get the remoteId, we can get from two of the methods given below:
    1. Approach #1 is that the property `currCall.peer` is actually the peerid of the remote peer.
    2. Approach #2 is mentioned in below code block:
        ```js
        for (let conns in peerConn.connections) {
            peerConn.connections[conns].forEach((conn, index, array) => {
                // here `conn.peer` is the remote peer id
            });
        }
        ```

## Components File Structure

> To Complete this section of the README.md

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
