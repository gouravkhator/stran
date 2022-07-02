# Stran - A Video Calling P2P Dapp

> **Know the unknowns, whilst being *private***

This is a video calling peer-to-peer decentralised app, centered to the users to connect with unknowns, whilst also being on the **3rd era of Web, i.e. the modern and more privacy-focused web**.

## Fancy Pics of this CoOl Project

The below pics are updated as on 14th June, 2022. They might not be the latest.

### Video Calling Main Page

![Video Calling Main Page](project-images/video_call_screen.png)

### Ongoing Call Screen

![Ongoing Call Page](project-images/ongoing_call_screen.png)

### One Step Login through MetaMask

![One Step Login through MetaMask](project-images/metamask_one_step_login.png)

## Project Installation

> This project currently does not use custom docker setup.

**Note: Currently, I have not tested docker setup fully. Yet, I am keeping the docker files in place, as we would need that for sure in future.**

### Prerequisites

- NodeJS version required is `v16.8.0`, bcoz node17 and above have breaking changes for the blockchain and hardhat framework.
- If we will be using ipfs services, then we have to install **go-ipfs** on your host system.

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

- Run a local redis server:

    ```sh
    # below command pulls the redis image and runs the redis container in background
    # when we will kill this container, it automatically would get removed too
    npm run redis:start

    # To enter into the redis container, run below commands
    docker exec -it redis /bin/bash
    # and then run below command inside that docker container, to have redis cli
    redis-cli
    ```

- Stop the redis docker service, and also remove that:

    ```sh
    npm run redis:stop
    ```

- Run a local ipfs node (it runs a daemon):

    ```sh
    ipfs daemon --enable-pubsub-experiment
    ```

- Compile the smart contracts:

    ```sh
    npm run sc:compile
    ```

- Run tests on smart contracts:

    ```sh
    npm run sc:test
    ```

- Run Hardhat Network, such that external clients can connect to it:

    ```sh
    npm run sc:localnode
    ```

- Connect ***MetaMask*** to Local node:

    - After running the local node, connect the MetaMask to that local node.
    - Then goto the metamask profile settings and to Advanced, then enable "Show Test Networks".
    - Then, click on the circle icon of yours, and then click "Import Account", and then provide the private key of one of the accounts of that localnode.
    - *Hurray!!*, you have successfully setup your localnode in Metamask.
    - Refer [this article](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13) for more details.

- Deploy the smart contract -- It will firstly compile the smart contracts and then would deploy them, and then copy the config to the correct server folder.

    ```sh
    npm run sc:deploy
    ```

- Build the client-side code and serve it locally:

    ```sh
    npm run app:serve
    ```

- Run a development spin for the client-side code, so that it can watch the file changes and reload:

    ```sh
    npm run app:start
    ```

- Test the frontend application:

    ```sh
    npm run app:test
    ```

## Docker Setup

### Prerequisites

- Install docker and docker-compose, and then enable the docker daemon service globally by the below command. The below command is for the ones, who run this repo on linux/mac machines with systemd in it.

    ```sh
    sudo systemctl start docker
    ```

### Docker Commands

> Run all the below commands only in the root folder context, as `docker-compose` command checks the file passed as parameter, and the current directory too..

- Build and run the project in Production mode using following command:

    ```sh
    npm run docker-prod:build
    ```

- Only run the already-built docker image in production mode:

    ```sh
    npm run docker-prod:up
    ```

- Build and run the project in development mode using following command:

    ```sh
    npm run docker-dev:build
    ```

- Only run the already-built docker image in development mode:

    ```sh
    npm run docker-dev:up
    ```

- Run the smart contract deploy script after the `docker-compose up` commands:

    ```sh
    npm run docker:sc:deploy
    ```

- Remove the created containers:
    
    ```sh
    npm run docker:down
    ```

    > Note: Doing `Ctrl+D` will only stop the container, but will not remove them.

## Credits to the Resources Used

- [Video on WebRTC, Video calling and Javascript integration](https://youtu.be/pv3UHYwgxnM)
- [Centralized Error Handling using Redux](https://www.pluralsight.com/guides/centralized-error-handing-with-react-and-redux)
- For blockchain deployment and testing inside docker container: [How To Dockerize Your Hardhat Solidity Contract On Localhost](https://codingwithmanny.medium.com/how-to-dockerize-your-hardhat-solidity-contract-on-localhost-a45424369896)
- [ExpressJS OPTIONS Request](http://johnzhang.io/options-request-in-express) and [CORS errors and Preflight requests](https://www.topcoder.com/thrive/articles/cors-errors-and-how-to-solve-them)
- [CORS Middleware](https://stackabuse.com/handling-cors-with-node-js/)
