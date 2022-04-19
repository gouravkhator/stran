# Done List

> Updated every month, from the checklist of `todo.md`

## Client End Only

- [x] Make all components in client end, the `.jsx` files.
- Calling Feature
  - [x] PeerJS feature implemented
- [x] Connect with Metamask.
- [x] Edit setState to have functions passed in instead of objects, so that functions won't be created again and again on re-renders..
- [x] Throw an object as a error and short error formatted object on client end too.
- [x] Signup, login and logout functionality client-side.
- [x] Global error handling
- [x] Use Redux for metamask account management

## Server End Only

- [x] Parse enums of the user returned directly in `smart-contract.service.js` file.
- [x] JWT token logout including saving invalid tokens to redis, and looking up blacklisted tokens from redis while authenticating tokens.
- [x] Add user CRUD operations in two places:
  - [x] CRUD operation implementation in `smart-contract.service.js`.
  - [x] CRUD operation implementation in server endpoints/routes/middlewares.

## Blockchain Solidity Only

- [x] Basic structure for smart contract
- [x] CRUD operation (including Update operation) implemented in smart contract code.

## Overall Feature

- [x] Rename npm scripts in package.json to be having colons for better script-names like server:start or server:dev etc.

## Features On Hold, but some parts completed

- Connecting with IPFS:
  - [x] IPFS basic connection and some basic required services.
