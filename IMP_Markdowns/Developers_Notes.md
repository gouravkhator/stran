## Some notes for developers 🧠

### Some Commands in Details

- Running the smart contract deploy script, inside the docker container:

    - Script to run:
    
      ```sh
      npm run docker:sc:deploy
      ```

    - NOTE: This deploy script deploys to the blockchain docker container. Then, this script also copies the config file from the `blockchain` container's `/usr/src/blockchain/contractsConfig/VideoCallContract.config.json` to the local host `./server/VideoCallContract.config.json`, and then from this local folder to the `backend` container's `/usr/src/server/VideoCallContract.config.json`.

    - Docker containers don't use same file system, so the `/usr/src` are different in those containers.

    - In future, if we try to integrate heroku/netlify, we will have to configure this copy of config in a different way, as these docker services will not run on local machine, rather will be on cloud. They should have some upload functionality, for transferring the contracts config file here and there.

### Services and their used Port numbers

| Service                    | Port Used   |
| -------------------------- | ----------- |
| IPFS WebUI                 | 5001        |
| IPFS Daemon Service        | 8080        |
| NodeJS Server              | 8081        |
| PreactJS Frontend          | 3000        |
| Local Blockchain Network   | 8545        |
| Redis Service              | 6379        |

### Docker containers interactions

- Outside docker, every service runs on `localhost`.

- But inside docker:
    - If a service let's say `backend` service of the docker-compose wants to interact with `redis-server` and `blockchain` internally, then it has to use the redis host as `redis-server` and blockchain host as `blockchain`, in the code for connecting.

    - If we run the services using docker-compose, the ports gets exposed to the localhost, and I can easily access frontend using "http://localhost:3000", or the server backend on "http://localhost:8081" or the redis service on localhost on TCP Port 6379 (Note: redis does not have http service). Blockchain network is accessible on localhost in the metamask extension on port 8545.

    - As we run the frontend from outside the docker, it should access the localhost and not the backend service that is given.

### Environment Variables

- The environment variables are mentioned in a all-in-one single local or single docker env file, for all the services.
    - We use `dotenv-cli` package in the root `package.json`, and for each script, we load the environment variables from the `.env.*` file mentioned, using this package.
    - This `dotenv-cli` loads the environment variables into that particular script, but to use those environment variables directly into a script, we have to do: `bash -c '<commands-with-args>'`
    - Note: `bash -c` is not necessary, if the environment variable is to be passed to the command like npm. Npm loads the variables by itself automatically from the environment.

- Environment variables `.env.*` files:
    - `.env.local`: This is the local environment file, which is for running the scripts on localhost, outside the docker environment.
    - `.env.docker`: This is the docker specific environment file, which is for running the scripts in the docker environment, with docker specific environment variables and values.
    - `.env.sample`: Sample file to make the respective above-mentioned env files with the similar field structures.

- To deploy the environment variables to production, we can directly add the variable names to the Heroku/Netlify/Other hosting platform.
    - **For example:-** If the process.env does not find the required variable in the `server` folder, then it will look for the environment defined in the parent folder of server, and if not there even, then it will go further upwards in the folder hierarchy.
