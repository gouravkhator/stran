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

- As we have multiple parts of the client side where we can get the error, so we don't use default Error object, rather we throw an object with below structure:

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

## States and their functionalities

### Calling State

* `peerConn` Object: It is the peer connection to the remote PeerJS server.
* `localStream` MediaStream Object: It is the MediaStream object for the current user's 2-in-1 video/audio stream.
* `remoteStream` MediaStream Object: It is the MediaStream object for the other side users' 2-in-1 video/audio stream.
* `micOn` boolean state: It is the boolean value denoting that microphone for the current user is on or not.
* `webcamOn` boolean state: It is the boolean value denoting that video for the current user is on or not.
* `currCall` Object: It is the call object, that is the incoming or outgoing call.
  * `currCall.peer` Property: It represents the peerid of the remote peer, who is in current call.
  * `currCall.connectionId` Property: It represents the current call unique id.
  * `currCall` Object is set as mentioned below on both the caller and callee sides:
    1. Set on the side of caller A, when A calls another person B,
    2. Set on the side of callee B, when B monitors the incoming call, which is now of caller A.
* `isCallee` and `isCaller` boolean states:
  * both isCallee and isCaller cannot be true at the same time,
  * but both can be false at the same time denoting that there is no call now..
  * isCaller is set on the caller side, when that user initiates the call.
  * isCallee is set on the callee side, when that user monitors the incoming call.
* `isAnswering` boolean state: It is set on the callee side, when the callee user clicks on Answer button, to answer the incoming call.
* `inCall` boolean state: It is set on both the caller and callee sides, when the caller initiates the call to someone, and when the callee also monitors the incoming call and gets an incoming call.

### User State

* `userdata` Object: It represents the user data JSON, sent from the server end in the similar format as below:

  ```js
  {
    'username': 'Gourav',
    'userid': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    'primaryLanguage': 'English',
    'location': 'Asia',
    ....
  }
  ```
* `loggedIn` boolean state: It is true if the `userdata.username` in the redux store is not empty else it is false.

  `userdata.username` is the only field which denotes accurate logged in status. `userdata.userid` is '0x0000000000' if the user does not exist, and so it requires more checks.

### MetaMask State

> To Complete this section of the README.md

### Global State

* `error`: It represents the per-page error messages.
* `message`: It represents the per-page success messages.
* `error` and `message` common notes:
  * Both states are maintained per-page, as we reset the global store states `error` and `message` whenever the route/path changes. This handling of resetting of error and message is done in the App.jsx file, in the Router onChange handler.
  * This is a needed action, so that we don't overload the app with other pages' error or success messages.
* `bannerMsg`: bannerMsg is the message only shown on the home page.
   * It is used in special situations only, like "After Deletion of account, it should show Sorry to let you go" on the home page.
   * In the home page, we don't show any `error` or `message`, as we want to keep the home page clean, and we won't get any home-page specific error and success message too.
   * But, after deletion of account or after some special situations, we may need to just click that button which would do some processing, and would directly redirect us to home page.
   * There, we need to show some banner message that "This operation has been completed".
   * This banner message is there just for 5 seconds intentionally and then reset back to empty string.

## Components File Structure

> To Complete this section of the README.md

## PeerJS API Structure and Usage

### Algorithmic Flow of the PeerJS Connections and state changes

> To Complete this section of the README.md

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
