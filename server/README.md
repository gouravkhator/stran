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

* [x] IPFS connect and its basic required services.
* [ ] Save cid to the smart contract.
* [ ] Caller and callee information to save and retrieve from smart contract.
* [ ] Either migrate to golang server code, or use wasm and docker to automate the CI/CD, to run ipfs daemon, before starting the nodejs server. 

## Some IPFS Data added via code

* [Random Data #1](https://ipfs.io/ipfs/QmSHwzocaPP7kzQ1ciqXppqbzQV6nnyaNakPbQQeFMVyTT)

## Some notes for developers

* Port 8080 and 5001 are for ipfs daemon services.
* I have used port 8081 for nodejs server.
* I have used port 3000 for client frontend.

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
