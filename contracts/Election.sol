//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Election {
    // Model a candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    // Store a candidate

    //Fetch Candidate
    mapping(uint256 => Candidate) public candidates;

    // Store candidate count
    uint256 public candidatesCount;

    //constructor
    constructor() {
        addCandidate("KamalHaasan");
        addCandidate("RajniKanth");
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}
