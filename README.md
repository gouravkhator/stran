# Stran - A Video Calling P2P Dapp

> **Know the unknowns, whilst being *private***

This is a video calling peer-to-peer decentralised app, centered to the users to connect with unknowns, whilst also being on the **3rd era of Web, i.e. the modern and more privacy-focused web**.

## Project Installation

### Prerequisites

Install go-ipfs on your host system. 

> We can use docker in future for managing these installs and other prerequisite commands on hosted server.

### Installation/Setup Guide 🤔

> Firstly, *clone this repository*.

1. Install all the npm packages required for smart contract code, frontend and server, in one go.

    ```sh
    npm run full-install
    ```

2. Install go-ipfs in the host system and then initialize the installed ipfs.

    The below command should be run only once, in the first initialization:

    ```sh
    ipfs init
    ```

3. Configure IPFS to allow CORS requests (needed this config only once):

    ```sh
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
    ```

## Hacky Commands for *Geeks* 🤓

* Run a local ipfs node (it runs a daemon):

    ```sh
    ipfs daemon --enable-pubsub-experiment
    ```

* Compile the smart contracts:

    ```sh
    npm run sc-compile
    ```

* Run tests on smart contracts:

    ```sh
    npm run sc-test
    ```

* Run Hardhat Network, such that external clients can connect to it:

    ```sh
    npm run sc-localnode
    ```

* Connect ***MetaMask*** to Local node:

    After running the local node, connect the MetaMask to that local node.
    
    Then, import the account, by providing the private key of one of the accounts of that localnode.

    Refer [this article](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13) for more details.

* Deploy the smart contract -- It will firstly compile the smart contracts and then would deploy them.

    ```sh
    npm run sc-deploy
    ```

* Build the client-side code and serve it locally:

    ```sh
    npm run app-start
    ```

* Run a development spin for the client-side code to watch the file changes and reload:

    ```sh
    npm run app-dev
    ```

* Test the frontend application:

    ```sh
    npm run app-test
    ```

## Some notes for developers 🧠

* IPFS WebUI: Port 5001
* IPFS Daemon Service: Port 8080
* Nodejs Server: Port 8081
* Client Frontend: Port 3000

## Theoretical Knowledge Base 😆

### System Design and Architecture

From Client side, user will login. User's login will be saved and an address will be provided to him by the ethereum network. This address will go to the smart contract code and registerUser will be called. User should keep the address with him, else his account will not be retrievable.

Now, when he gets to the main page, he sees his already added friends (if any). 
Also, he sees a call to stranger button. 

When he calls to stranger, that transaction will be saved to smart contract via the function doVideoCallStranger and there the call initiater's address can be referenced by msg.sender, but we will loop through all users and check who is available.

Also, we can index the isAvailable mapping.
Also, there can be an options/filters object.

These options contain caller's current options like:
* Which location's stranger, he prefers to call
* Which language's stranger, he prefers to call

These fields can be indexed too for optimization, like using mapping.

Now, we will filter all users' by live availability, required location and required language (if any options are applied, else we can avoid filtering).

The smart contract will save the video call transaction with all details, including the settings used, and duration, and whether this video call led to adding the stranger, a friend.

User can also call to an already added friend via doVideoCall function, where the address is also provided of the receiver. Here, it checks if the receiver is available or not, and if not, we can save the transaction, that video call was not possible due to this and this issue.

We can have an enum for all issues and their error codes. We can then use that error code globally in our application. 

deleteUser will also be a function in the smart contract.

We can use web workers in client side (for video calling) and smart contract transaction simultaneously and then sync them up with the results of whether the video call was a success or a failure.

We can use IPFS (some local decentralized storage) for storing the contract's transactions which are not synced with the mainnet. We can have them queued up locally.

Also, the video call logs will be fetched from smart contract. 

While accepting the call, recipient can deny it. He/she can also see the options set by caller, like the language wanted to be over call. 

Also, while calling a stranger mainly, we can filter by language and if the recipient has initially selected some set of known languages and if the required language (for now, field present in VideoCallOptions) is not present in the list of recipient's set of known languages, we can ignore that recipient to be called for now.

While calling a friend, the options is ignored completely.

---

## Credits

[This](https://youtu.be/pv3UHYwgxnM) video helped me in webrtc and javascript interaction.
