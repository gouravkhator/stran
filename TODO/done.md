# Done List

> Updated every month, from the checklist of `todo.md`

## Client End Only

- [ ] Bugs solved:
  - [x] `ISSUE`: delete request throws error of cors.. But POST and GET worked fine.. It was because of CORS preflight request, and I solved this by using cors npm package which provides pre-flight request management by default.
  - [x] `ISSUE`: When I just go to `/profile` or `/call` directly, it redirects me to the signin page.
    And it is because loggedIn and user are not loaded via fetch user by token.

    - [x] We should wait for that fetch to happen and then only show the app fully.

- [ ] Calling Feature
  - [x] PeerJS feature implemented
  - [x] Toggling of Mic and Webcam implemented.
  - [x] Set the Incoming call state to have the UI for "Incoming Call, Please answer"
  - [x] Call Random Available User implemented on Client End

- [ ] Redux and State Managements
  - [x] Metamask reducer
  - [x] User reducer
  - [x] Global other purpose reducers
  - [x] Global error handling
  - [x] Add Global message state, to have message for the user in some cases.

- [ ] CRUD implementation for user
  - [x] Signup, login and logout functionality client-side.
  - [x] Delete functionality to add in the profile page. 

- [x] Metamask
  - [x] Connect with Metamask.
  - [x] Metamask custom hooks for checking if it gets disconnected or not.

- [ ] General Other Tasks
  - [x] Throw an object as an error and short error formatted object, on client end too.
  - [x] Make all components in client end, the `.jsx` files.
  - [x] Edit setState to have functions passed in instead of objects, so that functions won't be created again and again on re-renders..

## Server End Only

- [x] Parse enums of the user returned directly in `smart-contract.service.js` file.
- [x] JWT token logout including saving invalid tokens to redis, and looking up blacklisted tokens from redis while authenticating tokens.
- [x] Add user's CRUD operations in two places in server-side:
  - [x] CRUD operation implementation in `smart-contract.service.js`.
  - [x] CRUD operation implementation in server endpoints/routes/middlewares.

## Blockchain Solidity Only

- [x] Basic structure for smart contract implementation.
- [x] Full CRUD operation implemented in smart contract code.

## Overall Feature

- [x] Rename npm scripts in package.json to be having colons for better script-names like server:start or server:dev etc.

## Features On Hold, but some of its parts completed

- Connecting with IPFS:
  - [x] IPFS basic connection and some basic required services.
