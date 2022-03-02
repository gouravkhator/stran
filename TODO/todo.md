# Checklist

## Features In-Progress

### Client End Only

* [ ] Global error handling
* [ ] UserAuth component completion, with account and user management, maybe using Redux

### Server End Only

* [ ] Parse enums of the user returned directly in `smart-contract.service.js` file.
* [ ] Add CRUD operations for user in contacting the smart contract, and also in the server endpoints.
    - [ ] Update operation remaining to implement in smart contract integration.
    - [x] Other operations like create user, delete user, add friend, get friends, get user data to add in smart contract integration.
    - [ ] Update and delete operation to implement in server endpoints' routes.

### Blockchain Solidity Only

* [ ]

### Overall In-Progress for full integration

* [ ] 

## Features Planned
* [ ] Privacy setting for every user
    - It is bcoz, every user can allow/deny his profile visibility.
    - There can be different settings for friends vs for other strangers.
* [ ] Have the Search functionality for any person, with filters of location and primary languages, and known languages.
* [ ] Call history to save and retrieve to/from smart contract.
* [ ] User preferred Location can be taken from browser current location data.
* [ ] Test cases for client and server side, and even for solidity code.

## Features on hold for now
* [ ] Connecting with IPFS:
    - [ ] Using docker for running IPFS daemon on them, or an online IPFS node runner.
