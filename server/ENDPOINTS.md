# Server Endpoints

Base URL for the local server: `http://localhost:8081/`

## Middlewares

### General Middlewares

- **makeImpConnectionsMiddleware**: Runs on every request to check and connect to the blockchain and redis services.
- **authenticateTokenMiddleware**: Run before all of the authentication/user endpoints.
    
    This checks if the jwt token is passed, and if it is valid or not. If valid, the user is set in the request object.

### Middlewares for Auth Endpoints

- **returnUserIfUserExists**: Run just before the `GET /auth/nonce`, `POST /auth/signup` and `POST /auth/verify` endpoints.
    
    Checks if the user is set in the  `authenticateTokenMiddleware` middleware, and if it is, then this middleware will just return that user, and not proceed with the respective endpoints. Else, if user is not set, it means the token passed in cookies was invalid, so we process the original auth route.

### Middlewares for User Endpoints

- **throwErrIfUserNotExist**: If user does not exist, it throws an `401 Unauthorized error`.

    Checks if the user is set in req object, and if it isn't, then throw the 401 error.

## HealthCheck Endpoints

- GET `/healthcheck`: It returns a 200 OK status code, with the message that the server is healthy. But, before the healthcheck url hit, the server runs all the middlewares defined above it, including our custom middleware too which is `makeImpConnectionsMiddleware`.

## Authentication Endpoints

Firstly, the `authenticateTokenMiddleware` sets the req.user based on valid JWT token provided in cookies. If the req.user is not set, then the token provided was invalid.

Secondly, the `returnUserIfUserExists` runs before some of the auth endpoints, and checks if the req.user is set or not. If it is set, then we don't need to process that particular auth routes and we can return the user directly.

- `GET /auth/nonce`: Pass the publicAddress of the blockchain wallet, and it will return a nonce.
- `POST /auth/signup`: Pass the user details and the public address of the wallet, and it will save the user in blockchain and return the user object.
- `POST /auth/verify`: Pass the public address and the signature. This endpoint will verify the signature and return the user data with the jwtToken saved in the client cookies.
- `POST /auth/logout`: Performs logout for the current user. It should also invalidate the jwtToken.

## User Endpoints

Firstly, the req.user is already set by `authenticateTokenMiddleware` before we get to user routes.

Secondly, the `throwErrIfUserNotExist` is run. If user is not set in previous middleware, then it throws an error (as we don't want to process user route without user being set).

- `GET /user`: Returns the user data.
- `PUT /user`: Edit the user data.
- `DELETE /user`: Deletes the user from the blockchain.

## Other Users Data Fetching Endpoints

Firstly, the req.user is already set by `authenticateTokenMiddleware` before we get to user routes.

Secondly, the `throwErrIfUserNotExist` is run. If user is not set in previous middleware, then it throws an error (as we don't want to process user route without user being set).

- `GET /users/random/available`: Returns the random available user's id.
- `GET /users/:friendUserId`: Returns the friend data by his/her user id.

## IPFS Endpoints

- `GET /ipfs/:cid`: Pass the path variable `cid` and it will return the data as the response, else a status of 404 Not Found.

- `POST /ipfs/`: Pass the data in the request body and it will return the saved cid, the ipfs url to access the data, and the success flag.
