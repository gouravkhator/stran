# Stran Server 

## Endpoints

Base URL for the local server: `http://localhost:8081/`

### Smart Contract Endpoints

* 

### IPFS Endpoints

* `GET /ipfs/:cid`: Pass the path variable `cid` and it will return the data as the response, else a status of 404 Not Found.

* `POST /ipfs/`: Pass the data in the request body and it will return the saved cid, the ipfs url to access the data, and the success flag.

## Server Folder Structure

> Credit goes to [geshan's expressjs-structure](https://github.com/geshan/expressjs-structure).

The main article for organizing the project structure is given [here](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/).

**Folders and their functions:**
* `src/controllers`: Controllers control the request and response that goes in and out, to and from the route. They are like utils to the routes.

* `src/middlewares`: Here we store middlewares, which behave like helper middlewares to the controllers and other requests.

* `src/routes`: Routes will contain the created express router, and those routes uses controllers for managing their requests and response flow.

* `src/services`: Services contain necessary methods for different phases of the app.

    Example: Connecting to ipfs or connecting to smart-contracts.

* `src/utils`: Utilities and helpers required throughout the app.

* `tests/`: Refer the below image.

    ![Test Folder Structure](https://blog.logrocket.com/wp-content/uploads/2022/01/Express-test-folder-structure.png)

    As you can see, ***tests for each unit of the src folder, will be created in the same structure in tests folder..***
