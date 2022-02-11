# Stran Server 

## Prerequisites

Install go-ipfs on your host system. 

> We can use docker in future for managing these installs and other prerequisite commands on hosted server, or just write all server code in golang.

## Commands

* Initialize the installed ipfs (it is run only once):

    ```sh
    ipfs init
    ```

* Run a local ipfs node (it runs a daemon):

    ```sh
    ipfs daemon --enable-pubsub-experiment
    ```

## Checklist for Server code

* [ ] Connection with IPFS:
    - [x] IPFS basic connection and some basic required services.
* [ ] Connection with Smart Contracts:
    - [ ] Implement CRUD operations of user details via smart contract.
    - [ ] Save ipfs cid to the smart contract.
    - [ ] Caller and callee information to save and retrieve from smart contract.
* [ ] Either migrate to golang server code, or use wasm and docker to automate the CI/CD, to run ipfs daemon, before starting the nodejs server.
* [ ] Postman Todos:
    - [ ] Do API testing using Postman or other automation api testing tools.
    - [ ] Save the API testing Postman requests/collections and tests in the `server` folder and push that to github too, without exposing Postman collections' environment variables.

## Sample IPFS Data added via code

* [Random Data #1](https://ipfs.io/ipfs/QmdRqHHVdU92TteMfNxrqQwbShLvysxXTuVjEQA2577Evf)

