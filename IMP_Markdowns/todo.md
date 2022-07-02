# Checklist

## Features In-Progress

### Client End Only

- [ ] Some current bugs
  - [ ] `ISSUE`: When I remove jwt token from cookies, the user state is not updated in the redux store. But, when I refresh the page, then all the components gets updated.

    - **Similar issue having same root cause**: When I remove the user or shut down the blockchain network fully, then also it shows that user is logged in, until and unless I refresh the page.

    - **One way to solve this** is to reload the page when we click on other routes.

    - We cannot listen to when the cookies/user were removed.

    - What we can also do is to **send a heartbeat to the server** for the validity of this user. Heartbeat can be implemented using setTimeout function and doing fetch to the /user route to the server. Currently, we perform health check only on route change.

- [ ] Fix the `"End Call" Issues`: 
  - [ ] Resolve the issue of endCall function, which only ends the call on the side I clicked the endCall.
    This issue is an [open issue in peerjs repo](https://github.com/peers/peerjs/issues/636) till now. 
    There are workarounds given, which we are trying to implement in our code. 
  - [ ] When user does not answer call, but clicks on end call button, firstly on callee side itself, conn.peerConnection is null in the method `manualConnectionClose`. Secondly, this end call should also let caller know that he has ended the call.

- [ ] Check if the inputted user id in the userid to call, exists or not in the blockchain.
- [ ] If user's status is available, but he is not ending the call or receiving it, then we should wait for 10 secs and then reset the call and close connection.
- [ ] When user provides the destination id, and when he clicks the enter key, it should invoke method initiate call to dest.
- [ ] Once the userid changes in the `VideoCall.logic.jsx` component, it normally re-renders the peer connection thing, and re-creates a new peer connection. But, it should close the old connection if possible.
- [ ] When calling, a sound should play at the caller and the callee side.
- [ ] If the camera permission or audio permission is not provided by the browser, then throw the error too.
- [ ] If the webcamOn state is false or if the remote peer's webcam is off, then show the blue screen only, and not that black weird default screen.
- [ ] Have two flaticon's icons namely "phone" and "shuffle" to make a merged icon for the "Call Random Available Stran"
- [ ] Show errors in important code blocks in the VideoCall and CurrCallPage components, and in peerjs.service.js files, on the promise and events code blocks.
- [ ] Profile and User
  - [ ] Edit functionality to add in profile page.

- [ ] Keep the user's data in encrypted way in local/other client side storage and keep that for a few mins like 1 or 2 mins, just to reduce the fetch user by token request to the server.

### Server End Only

- [ ] Current Bugs:
  - [ ] When I run the server with redis service off, and I try to send any request to server, it throws "503 redis connect err", but then I connect the redis, and then it processes the request. Then, when I disconnect the redis again, it crashes the server, saying that "Redis Socket Connection closed unexpectedly".
  
- [ ] Add `helmet` package, with proper options to let us use JWT also.

### Blockchain End Only

- [ ] `ISSUE`: knownLanguages array in `registerUser` solidity method is undefined and not saved when we fetch that.

### Docker End Only

- [ ] Current Issues:
  - [ ] For development volume mounting for reloading of images, we get error like `EACCES: permission denied` for blockchain service, when we use volume in docker-compose or in docker run like:

  ```yml
  volumes:
    - ./blockchain:/usr/src/blockchain
  ```

  Error message is mostly like below:
  
  ```sh
  glob error [Error: EACCES: permission denied, scandir '/root/.npm/_logs'] {
  ```
  
  It seems that the blockchain containerised application is writing data to the host machine, and maybe docker does not allow that.
  
  Currently, I have commented this, so that the docker runs fine for all cases.
  
- [ ] Deployment on Heroku/Netlify is kept on hold for now, as it requires much more config in the docker end.
  - [ ] When doing deployment on any platform, make sure that the contracts config copying part is taken care, by uploading the contracts abi and the contracts address somewhere. Locally, we copied the config json file to a local folder, but that won't work on the cloud.

- [ ] Tests should also be run inside docker containers, before we run the production build.

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

- [ ] Configure the Postman collection runner, to run the tests one by one in a sequence defined by me.
- [ ] Error reporting and logging to some tools available, just to monitor if everything is rightfully working or not.
- [ ] Privacy setting for every user
  - [ ] Have the current user permission to do CRUD on his own profile, but only view permission to partial data of his friends.
  - It is bcoz, every user can allow/deny his profile visibility.
  - There can be different settings for friends vs for other strangers.
  
- [ ] Have the Search functionality for any person, with filters of location and primary languages, and known languages.
- [ ] Call history to save and retrieve to/from smart contract.
- [ ] User preferred Location can be taken from browser current location data.
- [ ] Perform Testing for client and server side, and even for solidity (blockchain) code.
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
