# Project Flow in Brief

## Flowchart

To add a flowchart for the flow of the auth and the project working.
This flowchart can be made in any control-flow-chart maker software.

## Flow of the Routes and the Code

Firstly, Header fetches for the user details from the token, and sets the user in the redux store. If user does not exist, then just a Sign In button is shown in the Header.

If user exists, and if we visit /signin, the component shows our username and a link to our profile.

If user does not exist, we are shown the login/signup components.

When user clicks on `Login with Metamask`. It checks if the metamask is installed and account is connected. Else, it throws appropriate error.

Next, if Metamask is all setup, then if user clicks on `Login with Metamask`, then it will fetch the nonce by doing a GET request again to `/auth/nonce`, and then will send a prompt to the user to sign the nonce. Once, the user signs the nonce, the signature is sent to the server, as a POST request to `/auth/verify`.

If the signature is valid, the server returns a JWT token, to be automatically saved in the user's client side cookies.

Now, when the user visits our webapp, the token is sent to the server via the Header component, and the user data is returned from the server itself.

## System Design and Architecture

From Client side, user will login. User's login will be saved and an address will be provided to him by the ethereum network. This address will go to the smart contract code and registerUser will be called. User should keep the address with him, else his account will not be retrievable.

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

We can use web workers in client side (for video calling) and smart contract transaction simultaneously and then sync them up with the results of whether the video call was a success or a failure.

We can use IPFS (some local decentralized storage) for storing the contract's transactions which are not synced with the mainnet. We can have them queued up locally.

Also, the video call logs will be fetched from smart contract. 

While accepting the call, recipient can deny it. He/she can also see the options set by caller, like the language wanted to be over call. 

Also, while calling a stranger mainly, we can filter by language and if the recipient has initially selected some set of known languages and if the required language (for now, field present in VideoCallOptions) is not present in the list of recipient's set of known languages, we can ignore that recipient to be called for now.

While calling a friend, the options is ignored completely.
