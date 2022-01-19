# Stran - A Video Calling Hybrid DApp | Privacy with Fun, for connecting with passion

## System Design and Architecture

From React Native App, user will login. User's login will be saved and an address will be provided to him by the ethereum network. This address will go to the smart contract code and registerUser will be called. User should keep the address with him, else his account will not be retrievable.

Now, when he gets to the main page, he sees his already added friends (if any). 
Also, he sees a call to stranger button. 

When he calls to stranger, that transaction will be saved to smart contract via the function doVideoCallStranger and there the call initiater's address can be referenced by msg.sender, but we will loop through all users and check who is available.

Also, we can index the isAvailable mapping.
Also, there can be an options/filters object.

These options contain caller's current options like:
* Which location's stranger, he prefers to call
* Which language's stranger, he prefers to call

These fields can be indexed too for optimization, like using mapping.

Now, we will filter all users' by live availability, required location and required language (if any options are applied, else we can avoid filtering).

The smart contract will save the video call transaction with all details, including the settings used, and duration, and whether this video call led to adding the stranger, a friend.

User can also call to an already added friend via doVideoCall function, where the address is also provided of the receiver. Here, it checks if the receiver is available or not, and if not, we can save the transaction, that video call was not possible due to this and this issue.

We can have an enum for all issues and their error codes. We can then use that error code globally in our application. 

deleteUser will also be a function in the smart contract.

We can use web workers in react native (for video calling) and smart contract transaction simultaneously and then sync them up with the results of whether the video call was a success or a failure.

We can use IPFS (some local decentralized storage) for storing the contract's transactions which are not synced with the mainnet. We can have them queued up locally.

Also, the video call logs will be fetched from smart contract. 

While accepting the call, recipient can deny it. He/she can also see the options set by caller, like the language wanted to be over call. 

Also, while calling a stranger mainly, we can filter by language and if the recipient has initially selected some set of known languages and if the required language (for now, field present in VideoCallOptions) is not present in the list of recipient's set of known languages, we can ignore that recipient to be called for now.

While calling a friend, the options is ignored completely.

---

## Project Installation

### Prerequisite Software 

Check out [this](https://reactnative.dev/docs/environment-setup#installing-dependencies) link. It helps in setting up required softwares for smart contracts and react native development.

---

### Installation Guide

> Firstly, *clone this repository*.

Install all the npm packages required for smart contract code and frontend, in one go.

```bash
npm run full-install
```

---
---

## Hacky Commands for *Geeks*

Compile the smart contracts:

```bash
npm run sc-compile
```

Run tests on smart contracts:

```bash
npm run sc-test
```

Run tests on smart contracts:

```bash
npm run sc-test
```

Run Hardhat Network, such that external clients can connect to it:

```bash
npm run sc-localnet
```

Deploy the smart contract -- It will firstly compile the smart contracts and then would deploy them.

```bash
npm run sc-deploy
```

Start the React Native App Development Server:

```bash
npm run app-start
```

Run tests on the React Native App:

```bash
npm run app-test
```
