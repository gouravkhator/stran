# Stran Server 

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

    As you can see, ***tests for each unit of the src folder, can be created in the same structure in tests folder..***

## [Services]('server/src/services')

### [Smart Contract Service]('server/src/services/smart-contract.service.js')

- It is for internal usage in the server end only.
- As we know that when we save any data to blockchain, we have to pass the number/index for every enum in blockchain.
- When we fetch the saved data from blockchain, it will return us that index/number enclosed in string.
- Example:
    ```ts
    enum Language {
        FRENCH,
        ENGLISH,
    }

    User {
        Language language
    }

    const user = user(1); // 1 is passed for setting language as ENGLISH
    const savedData = saveDataToBlockchain(user);

    savedData becomes {
        language: '1', // that index is enclosed in string
    }
    ```

- Two methods namely `cleanseUserData` and `makeDataBlockchainCompat` works beautifully in providing the below leverage to consumers of this service:
    - `cleanseUserData`: This smart contract service processes some methods and at the end, always parses the data and returns the enum fields like language as 'ENGLISH'..
    - `makeDataBlockchainCompat`: When using this smart contract service, it lets us pass the data/fields in word formats like 'ENGLISH', and it makes that data compatible to blockchain by mapping that word to number.

### [Redis Service]('server/src/services/redis.service.js')

### [Auth Service]('server/src/services/auth.service.js')

### [Blockchain Init Service]('server/src/services/blockchain-init.service.js')

