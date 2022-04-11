# Stran - A Video Calling P2P Dapp

> **Know the unknowns, whilst being *private***

This is a video calling peer-to-peer decentralised app, centered to the users to connect with unknowns, whilst also being on the **3rd era of Web, i.e. the modern and more privacy-focused web**.

## Project Installation

> This project currently does not use custom docker setup.

**Note: Currently, I have not tested docker setup fully. Yet, I am keeping the docker files in place, as we would need that for sure in future.**

### Prerequisites

If we will be using ipfs services, then we have to install **go-ipfs** on your host system. 

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
    docker run --name redis -p 6379:6379 -d --rm redis

    # To enter into the redis container, run below commands
    docker exec -it redis /bin/bash
    # and then run below command inside that docker container, to have redis cli
    redis-cli
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
    - Then, import the account, by providing the private key of one of the accounts of that localnode.
    - Refer [this article](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13) for more details.

- Deploy the smart contract -- It will firstly compile the smart contracts and then would deploy them.

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

- Before running docker, edit below things that should be done as per docker setup:
    - The package.json in blockchain has a docker:deploy script, which deploys to host `blockchain`.
    - Redis connection uri should be changed to `redis://redis-server:6379`, in the file: `server/src/services/redis.service.js`.
- Install docker and docker-compose, and then enable the docker daemon service globally.

### Docker Commands

> Run all the below commands only in the root folder context, as `docker-compose` command checks the file passed as parameter, and the current directory too..

- Build and run the project in Production mode using following command:

    ```sh
    docker-compose -f docker-compose.prod.yml up --build
    ```

- Only run the already-built docker image in production mode:

    ```sh
    docker-compose -f docker-compose.prod.yml up
    ```

- Build and run the project in development mode using following command:

    ```sh
    docker-compose -f docker-compose.yml up --build
    ```

- Only run the already-built docker image in development mode:

    ```sh
    docker-compose -f docker-compose.yml up
    ```

- Run the deploy script after the `docker-compose up` commands:

    ```sh
    docker exec -it blockchain /bin/sh -c "cd /usr/src/blockchain; npm run docker:deploy";
    ```

- Remove the created containers:
    
    ```sh
    docker-compose down
    ```

    > Note: Doing `Ctrl+D` will only stop the container, but will not remove them.

## Some notes for developers 🧠

### Services and their used Port numbers

| Service                    | Port Used   |
| -------------------------- | ----------- |
| IPFS WebUI                 | 5001        |
| IPFS Daemon Service        | 8080        |
| NodeJS Server              | 8081        |
| PreactJS Frontend          | 3000        |
| Local Blockchain Network   | 8545        |

### Environment Variables

- The sample files for environment variables is mentioned in both the client-side and server-side.
- To deploy the environment variables to production, we can directly add the variable names to the Heroku/Netlify/Other hosting platform.
    - **For example:-** If the process.env does not find the required variable in the `server` folder, then it will look for the environment defined in the parent folder of server, and if not there even, then it will go further upwards in the folder hierarchy.

## Credits

- [Video on WebRTC, Video calling and Javascript integration](https://youtu.be/pv3UHYwgxnM)
- [Centralized Error Handling using Redux](https://www.pluralsight.com/guides/centralized-error-handing-with-react-and-redux)
