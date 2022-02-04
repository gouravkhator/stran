# Stran Server 

## Prerequisites

Install go-ipfs on your host system. 

> We can use docker in future for managing these installs and other prerequisite commands on hosted server, or just write all server code in golang.

## Commands 

Initialize the installed ipfs (it is run only once):

```sh
ipfs init
```

Run a local ipfs node (it runs a daemon):

```sh
ipfs daemon --enable-pubsub-experiment
```

## Checklist for Server code

* [ ] Connection with IPFS:
    - [x] IPFS basic connection and some basic required services.
* [ ] Connection with Smart Contracts:
    - [ ] Save cid to the smart contract.
    - [ ] Caller and callee information to save and retrieve from smart contract.
* [ ] Either migrate to golang server code, or use wasm and docker to automate the CI/CD, to run ipfs daemon, before starting the nodejs server.
* [ ] Postman Todos:
    - [ ] Do API testing using Postman or other automation api testing tools.
    - [ ] Save the API testing Postman requests/collections and tests in the `server` folder and push that to github too, without exposing Postman collections' environment variables.

## Some IPFS Data added via code

* [Random Data #1](https://ipfs.io/ipfs/QmdRqHHVdU92TteMfNxrqQwbShLvysxXTuVjEQA2577Evf)

## Some notes for developers

* IPFS WebUI: Port 5001
* IPFS Daemon Service: Port 8080
* Nodejs Server: Port 8081
* Client Frontend: Port 3000

## Some issues faced in the past

* When ipfs-core package was used, and go-ipfs was not installed on system:

```
When create is called, the node object is sent to ipfs.middleware.js and then from there,
req.session.ipfsNode is assigned to this node.
When we call res.send or res.end or res.sendStatus etc. methods, it internally does
JSON.stringify(res.session), and res.session.ipfsNode cannot be stringified.

As it is circular in nature, and if stringified will result in below error:

TypeError: Converting circular structure to JSON
--> starting at object with constructor 'Libp2p'
|     property '_options' -> object with constructor 'Object'
|     property 'modules' -> object with constructor 'Object'
|     ...
|     property '_wan' -> object with constructor 'KadDHT'
--- property '_libp2p' closes the circle
at JSON.stringify (<anonymous>)
```

* 
