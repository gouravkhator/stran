# Checklist

## Features In-Progress

### Client End Only

- [ ] Some current bugs
  - [ ] `ISSUE`: When metamask is disabled, we cannot figure out on how to listen to that.
  - [ ] `ISSUE`: When I signin, and account does not exist, then if I create account from postman, and click on Login again, then it again throws the same error. The component is not refreshed.
  - [ ] `ISSUE`: When I remove the user or shut down the blockchain network fully, then also it shows that user is logged in, until and unless I refresh the page.
- [ ] Edit setState to have functions passed in instead of objects, so that functions won't be created again and again on re-renders..
- [ ] Use Redux for user login, signup and logout states..
- [x] Global error handling
- [x] Use Redux for metamask account management

### Server End Only

- [x] Parse enums of the user returned directly in `smart-contract.service.js` file.
- [ ] `ISSUE`: knownLanguages array in `smart-contract.service.js` createUser method becomes undefined after we save it to blockchain.
- [ ] Add CRUD operations for user in contacting the smart contract, and also in the server endpoints.
  - [ ] Update operation remaining to implement in smart contract integration.
  - [x] Other operations like create user, delete user, add friend, get friends, get user data to add in smart contract integration.
  - [ ] Update and delete operation to implement in server endpoints' routes.

### Blockchain Solidity Only

- [ ] 

### Overall Project's In-Progress Items

- [ ] Configure the Postman collection runner, to run the tests one by one in a sequence defined by me. 

## Features Planned

### Client End Only

- [ ] Migrate client code from preact-cli to ViteJS, using [my Preact + ViteJS](https://github.com/gouravkhator/previte) template.
- [ ] Have the env working in the client end.

### Server End Only

- [ ] User shpuld not request multiple times for same things, or else sent a `429 Too Many Requests` as the response status code.
- [ ] Host your own peer server, which will not go down anytime, and we will have no dependency on public free peer server.

### Blockchain Solidity Only

- [ ] 

### Overall Project's Features Planned

- [ ] Privacy setting for every user
  - It is bcoz, every user can allow/deny his profile visibility.
  - There can be different settings for friends vs for other strangers.
- [ ] Have the Search functionality for any person, with filters of location and primary languages, and known languages.
- [ ] Call history to save and retrieve to/from smart contract.
- [ ] User preferred Location can be taken from browser current location data.
- [ ] Test cases for client and server side, and even for solidity code.
- [ ] Postman Export with versioning in the filename/file's contents.
- [ ] Add a flowchart for the whole project flow, in the `Project_Flow_In_Brief.md` file.

## Features on hold for now

- [ ] Server auth endpoints to be hosted in different server, rather than the main server, so as to reduce the requests load on only one server.
- [ ] Connecting with IPFS:
  - [ ] Using docker for running IPFS daemon on them, or an online IPFS node runner.
