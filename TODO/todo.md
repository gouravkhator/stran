# Checklist

## Features In-Progress

### Client End Only

- [ ] Some current bugs
  - [ ] `ISSUE`: When I remove jwt token from cookies, the user state is not updated in the redux store. But, when I refresh the page, then all the components gets updated.

    - **Similar issue having same root cause**: When I remove the user or shut down the blockchain network fully, then also it shows that user is logged in, until and unless I refresh the page.

    - **One way to solve this** is to reload the page when we click on other routes.

    - We cannot listen to when the cookies/user were removed.

    - What we can also do is to **send a heartbeat to the server** for the validity of this user. Heartbeat can be implemented using setTimeout function and doing fetch to the /user route to the server.
    
  - [ ] `ISSUE`: When I just go to `/profile` or `/call` directly, it redirects me to the signin page.
    And it is because loggedIn and user are not loaded via fetch user by token.

    - [ ] We should wait for that fetch to happen and then only show the app fully.

    - [ ] Also, we should keep the user's data in encrypted way in local storage and keep that for only a few seconds till we know that we have the token fetch successful.

- [x] Add Global message state, to have message for the user in some cases

### Server End Only

- [ ] Add helmet with proper options to let us use JWT also.

### Blockchain Solidity Only

- [ ] `ISSUE`: knownLanguages array in registerUser method is undefined and not saved when we fetch that.

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

- [ ] Docker Integration for below services:
  1. Peerjs server (as free server is mostly down)
  2. Blockchain network with persistence, only required in dev mode, as we will have main net in the prod mode.
  3. Client side
  4. Main server side
  5. Redis service
      > Keep redis and other service working in different docker containers.
      And keep the app in a different one, so that when we have to update the app and restart the server, then the redis cache does not get flushed.
  6. IPFS node to be running inside docker, if we need IPFS functionality in future.
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
