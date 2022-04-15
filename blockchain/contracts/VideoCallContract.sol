// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "../utils/Datetime.sol"; // for datetime, if not needed, we will remove this import in future.
import "../utils/global_enums.sol"; // for global enums like languages, locations etc.

contract VideoCallContract {
  // TODO: Index some userdata like the status, location, language for optimised access

  // ---structs--- : Defines the schema
  struct User {
    address userid;
    uint256 nonce;
    string username;
    Location location;
    Language primaryLanguage;
    Language[] knownLanguages;
    uint256 lastLoggedIn; // timestamp, which can be parsed in the javascript end
    Status status;
    VideoCallOptions callerOptions;
    address[] friends;
    // address array is used, so that we can lookup every user from address, via the userdata mapping
  }

  struct VideoCallOptions {
    Language requiredLanguage;
    Location requiredLocation;
  }

  struct VideoCall {
    uint256 startTime;
    uint256 duration;
  }

  // ---mappings--- : Used for lookups or setting of any data via address
  mapping(address => User) public userdata;

  address[] public users; // all users' address are saved here

  // ---events---

  // ---constructor---
  constructor() {}

  // ---functions---
  /*
    Returns uint random number for our one-time nonce.. 
  */
  function getRandomNumber() private view returns (uint256) {
    uint256 data = block.difficulty + block.timestamp;
    bytes memory dataInBytes = new bytes(32);
    assembly {
      mstore(add(dataInBytes, 32), data)
    }

    return uint256(keccak256(dataInBytes));
  }

  // registerUser
  function registerUser(
    string memory name,
    Location location,
    Language primaryLanguage,
    Language[] memory knownLanguages
  ) public returns (address) {
    // Checks if the current userid does not exists in the userdata mapping..
    require(userdata[msg.sender].userid <= address(0));

    // !ISSUE: knownLanguages is not actually set properly in this registerUser method.

    address[] memory emptyArr;
    // setting userdata
    /*
      user has just registered so we keep him in DND mode
      set the status to AVAILABLE, once he is fully logged in.
    */
    userdata[msg.sender] = User({
      userid: msg.sender,
      nonce: getRandomNumber(),
      username: name,
      location: location,
      primaryLanguage: primaryLanguage,
      knownLanguages: knownLanguages,
      status: Status.DND,
      callerOptions: VideoCallOptions({
        requiredLanguage: primaryLanguage,
        requiredLocation: location
      }),
      lastLoggedIn: block.timestamp,
      friends: emptyArr
    });

    users.push(msg.sender); // inserting user's address to the global users list
    return msg.sender; // return the address
  }

  // doVideoCall, doVideoCallWithStranger with options which can be saved in blockchain.
  function doVideoCall() public {}

  function doVideoCallStranger() public {}

  // updateUser
  function updateUser(
    string memory name,
    Location location,
    Language primaryLanguage,
    Language[] memory knownLanguages
  ) public {
    require(userdata[msg.sender].userid > address(0));

    // refer https://ethereum.stackexchange.com/a/42423 for why we use storage keyword instead of memory keyword..
    User storage existingUser = userdata[msg.sender];
    existingUser.username = name;
    existingUser.location = location;
    existingUser.primaryLanguage = primaryLanguage;

    // Why we should copy array like from memory to storage: https://stackoverflow.com/a/71820669
    existingUser.knownLanguages = knownLanguages;
  }

  function deleteUser() public {
    /*
      Why we need to iterate to search if the user is present or not?

      > Copy last value to users[i] place and then remove last value from the users list.
      This is done to avoid shifting operations in array while deleting a value..
      That is why for delete operation, we cannot just lookup the userid via userdata mapping and check if user exists or not..
      Bcoz, we need the exact location of that user's address in the users (addresses) array..
    */
    uint256 i;

    // linearly search for the current sender
    for (i = 0; i < users.length; i++) {
      if (users[i] == msg.sender) {
        break;
      }
    }

    /*
      if the user to be removed is not present, then, variable i will be equal to users.length
      and we should not proceed further for deletion,
      so we use require method, for proceeding only when i < users.length
    */
    require(i < users.length);

    /*
      This delete keyword works only when mapped value is a struct.. It sets all values to zeros.
      Refer this for more details : https://ethereum.stackexchange.com/a/15282
    */
    delete userdata[msg.sender];

    /*
      Copy last value to users[i] place and then remove last value from the users list.
      This is done to avoid shifting operations in array while deleting a value..
    */
    users[i] = users[users.length - 1];
    users.pop(); // remove last value from the list
  }

  function addFriend(address friendToAdd) public {
    // if this friend to add is actually a valid user, then we add that friend
    require(userdata[friendToAdd].userid > address(0));

    userdata[msg.sender].friends.push(friendToAdd);
  }

  // ---read-only functions---
  function getFriendsList() public view returns (address[] memory) {
    if (userdata[msg.sender].friends.length > 0) {
      return userdata[msg.sender].friends;
    }

    address[] memory temp;
    return temp; // returning empty object
  }

  function getRandomAvailableUser() public view returns (address) {
    uint256 i;

    for (i = 0; i < users.length; i++) {
      if (userdata[users[i]].status == Status.AVAILABLE) {
        return users[i];
      }
    }

    return address(0); // invalid user, which denotes that no user is available
  }
}
