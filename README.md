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

## Credits

[This](https://youtu.be/pv3UHYwgxnM) video helped me in webrtc and javascript interaction.
