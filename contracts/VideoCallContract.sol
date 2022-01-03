// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./utils/Datetime.sol"; // for datetime, if not needed, we will remove this import in future.
import "./utils/global_enums.sol"; // for global enums like languages, locations etc.

contract VideoCallContract {
    // TODO: Index some userdata like the status, location, language for optimised access

    // ---structs--- : Defines the schema
    struct User {
        address userid;
        string username;
        Location location;
        Language primaryLanguage;
        Language[] knownLanguages;
        uint256 lastLoggedIn; // timestamp, which can be parsed in the javascript end
        Status status;
        VideoCallOptions callerOptions;
        address[] friends;
        // array of address is used, as we can lookup every user from address, via the userdata mapping
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
    // registerUser
    function registerUser(
        string memory name,
        Location location,
        Language primaryLanguage,
        Language[] memory knownLanguages
    ) public {
        // TODO: Check if the same user exists in this array or not (maybe we set userid to the one user gives as input).

        address[] memory emptyArr;

        // setting userdata
        userdata[msg.sender] = User({
            userid: msg.sender,
            username: name,
            location: location,
            primaryLanguage: primaryLanguage,
            knownLanguages: knownLanguages,
            status: Status.DND, // user has just registered so we keep him in DND mode
            // set the status to AVAILABLE, once he is fully logged in. 

            callerOptions: VideoCallOptions({
                requiredLanguage: primaryLanguage,
                requiredLocation: location
            }),
            lastLoggedIn: block.timestamp,
            friends: emptyArr
        });

        users.push(msg.sender); // inserting user's address to the global users list
    }

    // doVideoCall, doVideoCallWithStranger with options which can be saved in blockchain.
    function doVideoCall() public {}

    function doVideoCallStranger() public {}

    function addFriend(address friendToAdd) public {
        if(userdata[friendToAdd].userid > address(0)){
            // this friend to add is actually a valid user
            userdata[msg.sender].friends.push(friendToAdd);
        }
    }

    function deleteUser() public {
        // TODO: check while deleting user, do we also have to invalidate the data in the mapping, by setting the different object for that address??

        uint i;

        for(i = 0; i < users.length; i++){
            if(users[i] == msg.sender){
                break;
            }
        }

        // if the user to be removed was not found, i will be users.length
        // and we should not proceed further for deletion, so we use require for proceeding only when i < users.length
        require(i < users.length);

        users[i] = users[users.length - 1];
        users.pop();
    }

    // ---read-only functions---
    function getFriendsList() public view returns (address[] memory) {
        if (userdata[msg.sender].friends.length > 0) {
            return userdata[msg.sender].friends;
        }

        address[] memory temp;
        return temp; // returning empty object
    }

    function getRandomAvailableUser() public view returns (address){
        uint i;

        for(i = 0; i < users.length; i++){
            if(userdata[users[i]].status == Status.AVAILABLE){
                return users[i];
            }
        }

        return address(0); // invalid user, which denotes that no user is available
    }
}
