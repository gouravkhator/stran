# Server Endpoints

Base URL for the local server: `http://localhost:8081/`

## Authentication Endpoints

### Middlewares
> **authenticateTokenMiddleware** - Run before all of the following authentication endpoints.
This checks if the jwt token is passed, and if it is valid or not. If valid, the user is set in the request object.

> **returnUserIfUserExists** - Run just before the `GET /auth/nonce`, `POST /auth/signup` and `POST /auth/verify` endpoints.
Checks if the user is set in the previous middleware, and if it is, then this middleware will just return that user, and not proceed with the respective endpoints.

* `GET /auth/nonce`: Pass the publicAddress of the blockchain wallet, and it will return a nonce.
* `POST /auth/signup`: Pass the user details and the public address of the wallet, and it will save the user in blockchain and return the user object.
* `POST /auth/verify`: Pass the public address and the signature. This endpoint will verify the signature and return the user data with the jwtToken saved in the client cookies.
* `POST /auth/logout`: Logs out the current user.

## IPFS Endpoints

* `GET /ipfs/:cid`: Pass the path variable `cid` and it will return the data as the response, else a status of 404 Not Found.

* `POST /ipfs/`: Pass the data in the request body and it will return the saved cid, the ipfs url to access the data, and the success flag.
