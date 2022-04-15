# Stran Blockchain

## Some Knowhows and Tricky Areas

- Solidity enums and Javascript representation of these enums:

  - Enums in solidity are depicted in javascript as 0-based indexed arrays.

  - A field let's say of type enum: `Language`, will have values like 0, 1, 2....`<total languages length - 1>`.

  - So, if we want to save a user with language Hindi, the value we will pass will be 1 (as English is at index 0, Hindi at index 1).

  - And, when reading the values, we again get this 0-based index. And we have to decode it again in javascript end..

  - Then, why we store enums instead of regular numbers ?
    > So, that we can encode and decode them as per the fixed list of values.

  - Why do we not store the values as strings ?
    > Enums have fixed length, and storing them as numbers reduces storage cost.
    Also, storing the values as enums instead of strings, helps us in not saving any out-of-bound values.

  - If we try to save a number which is out of enums length bound, this solidity will itself throw an error, not letting us save invalid enum values.

  - But, saving a string can cause users to save any random thing if they get hold of blockchain service, with all checks bypassed at server end.

- To get the existing struct data, we use storage keyword instead of memory keyword.
  - Example:
    ```js
    User storage existingUser = userdata[msg.sender];
    existingUser.username = name;
    existingUser.location = location;
    ```

  - Refer https://ethereum.stackexchange.com/a/42423 for why we use storage keyword instead of memory keyword..
- To copy an array from memory to storage type:
  - Example:
    ```js
    function updateUser(Language[] memory knownLanguages) public {
      User storage existingUser = userdata[msg.sender];
      existingUser.knownLanguages = knownLanguages;
    }
    ```
  - Refer https://stackoverflow.com/a/71820669 on why we copy an array like this.

- **Prettier for solidity**:
  - We can install `prettier-plugin-solidity` npm package and run the normal `npm run check-format` and `npm run format`, but if we have comments in the solidity files, we should make sure that **no comment is there inside the object we are making instance of**.
  
  - Example:
    ```js
    userdata[msg.sender] = User({
      userid: msg.sender,
      // DON'T keep any comment here inside the params of a function..
      username: name
    });
    ```

  - If we keep the comment inside the params like above, then we get an error like: `Error: Comment "x" was not printed. Please report this error!`..
