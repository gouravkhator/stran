# Checklist

## Features In-Progress

### Client End Only

- [ ] Some current bugs
  - [ ] `ISSUE`: When I remove jwt token from cookies, the user state is not updated in the redux store. But, when I refresh the page, then all the components gets updated.

    - **Similar issue having same root cause**: When I remove the user or shut down the blockchain network fully, then also it shows that user is logged in, until and unless I refresh the page.

    - **One way to solve this** is to reload the page when we click on other routes.

    - We cannot listen to when the cookies/user were removed.

    - What we can also do is to **send a heartbeat to the server** for the validity of this user. Heartbeat can be implemented using setTimeout function and doing fetch to the /user route to the server.
  - [ ] `ISSUE`: When I click on left/right for navigating through the browser history, I can go to the signed in state again, even if I am currently signed out.
  - [ ] `ISSUE`: When I click on other routes, the error shown on current page should not be shown on other page.

- [ ] End Call Issues and Checks to Validate: 
  - [ ] Resolve the issue of endCall function, which only ends the call on the side I clicked the endCall.
    This issue is an [open issue in peerjs repo](https://github.com/peers/peerjs/issues/636) till now. 
    There are workarounds given, which we are trying to implement in our code. 
  - [ ] Check if the end call button click is working, when user does not answer the call, but clicks on end call button.
- [ ] If the webcamOn state is false, then show the blue screen only, and not that black weird default screen.
- [ ] Have two flaticon's icons namely "phone" and "shuffle" to make a merged icon for the "Call Random Available Stran"
- [ ] Show errors in important code blocks in the VideoCall and CurrCallPage components, and in peerjs.service.js files, on the promise and events code blocks.
- [ ] Profile and User
  - [ ] Edit functionality to add in profile page.

- [ ] Keep the user's data in encrypted way in local/other client side storage and keep that for a few mins like 1 or 2 mins, just to reduce the fetch user by token request to the server.

### Server End Only

- [ ] Add `helmet` package, with proper options to let us use JWT also.

### Blockchain End Only

- [ ] `ISSUE`: knownLanguages array in `registerUser` solidity method is undefined and not saved when we fetch that.

### Overall Project's In-Progress Items

- [ ] 

## Features Planned

### Client End Only

- [ ] Migrate client code from preact-cli to ViteJS, using [my Preact + ViteJS](https://github.com/gouravkhator/previte) template.
- [ ] Have the env variables, functionally working in the client end.

### Server End Only

- [ ] User should not request multiple times for same things, or else sent a `429 Too Many Requests` as the response status code.
- [ ] Host your own peer server, which will not go down anytime, and we will have no dependency on public free peer server.
- [ ] Redis service: create child process in server end, for connecting with redis server.

### Blockchain End Only

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

- [ ] Remove VideoSDK code from server and client end, once all the video calling using peerjs is set.
- [ ] Configure the Postman collection runner, to run the tests one by one in a sequence defined by me.
- [ ] Error reporting and logging to some tools available, just to monitor if everything is rightfully working or not.
- [ ] VideoSDK provides the createMeeting option, where we can have a region-based meeting creation, to improve latency.
- [ ] Privacy setting for every user
  - [ ] Have the current user permission to do CRUD on his own profile, but only view permission to partial data of his friends.
  - It is bcoz, every user can allow/deny his profile visibility.
  - There can be different settings for friends vs for other strangers.
  
- [ ] Have the Search functionality for any person, with filters of location and primary languages, and known languages.
- [ ] Call history to save and retrieve to/from smart contract.
- [ ] User preferred Location can be taken from browser current location data.
- [ ] Test cases for client and server side, and even for solidity code.
- [ ] Postman Export with versioning in the filename/file's contents.
- [ ] Add a flowchart for the whole project flow, in the `Project_Flow_In_Brief.md` file.

## Features on hold for now

### Client End Only

- [ ] 

### Server End Only

- [ ] Server auth endpoints to be hosted in different server, rather than the main server, so as to reduce the requests load, caused on that only server.

### Blockchain End Only

- [ ] Index some userdata like the status, location, language in smart contract solidity code, for optimised access.
- [ ] Add a ***rinkeby*** network in the `hardhat.config.js` file for deploying the contracts on that test net.

### Overall Project's Features On Hold

- [ ] Connecting with IPFS:
  - [ ] Using docker for running IPFS daemon on them, or an online IPFS node runner.
