// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./utils/Datetime.sol"; // for datetime
import "./utils/global_enums.sol"; // for global enums like languages, locations etc.

contract VideoCallingService {
    // ---structs---
    struct User {
        address user_id;
        string username;
        Location location;
        Language primaryLanguage;
        Language[] knownLanguages;
    }

    struct VideoCallOptions{
        Language requiredLanguage;
        Location requiredLocation;
    }

    struct VideoCall {
        Datetime call_time;
        Datetime duration;
    }

    // ---mappings---
    mapping(address => User) public users;
    mapping(address => User[]) public friends;
    mapping(address => bool) public isAvailable;
    mapping(address => VideoCallOptions) public callerOptions;

    // ---events---

    // ---constructor---
    constructor() {}

    // ---functions---
    // registerUser
    function registerUser() public {}

    // doVideoCall, doVideoCallWithStranger with options which can be saved in blockchain.
    function doVideoCall() public {}

    function doVideoCallStranger() public {}

    function addFriend() public {}

    function deleteUser() public {}
}
