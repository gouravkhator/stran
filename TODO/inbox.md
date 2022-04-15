# INBOX -- Track Features/Things to note down

## Inbox -- Collect whatever stuff

### Implementation thoughts

- **Redis and Docker**:
    
    - JWT token logout will involve saving tokens in redis as invalid tokens, when user requests for logout. 
    And when we do authenticate tokens, it should also lookup in the redis if this token is blacklisted or not.

    - But as there are so many services to be run to start developing the webapp, we can make a docker container to run all those services. It will be better for production too.

    - Redis works in-memory, and if I publish a new update for my webapp, the docker will restart all services and if redis is restarted, then all the invalid/blacklisted tokens will get destroyed.

    - Also, we can store each invalid tokens with an expiration time of around 1 day, as after 1 day, the user will obviously be asked to login again which will generate new tokens. This is because the tokens saved in the cookies also have expiration of 1 day.

### Info To Be Noted for future

- 

### Check and Research

- [ ] What server does torrent use out of STUN and TURN, to make a peer network ?
- [ ] 

## OKR -- The Objective Keys and Results

Monthly ammended. With all its history.

## Don't Do

Anything not meeting the current OKR. You may repeatedly come up with the same idea once in a long period, with the same time-wasting procedures to deal with it. So the best solution is just to write it down as a notice.

- We cannot check the metamask disabled/uninstalled/installed state without the webapp refresh.

    - `ISSUE`: When metamask is disabled/uninstalled, we cannot listen to those events. When I refresh the page, then it detects that window.ethereum is not defined, so it throws valid error to the user. Similar is the case while installing of extension too.

    - This is an already `OPEN` existing issue in metamask extension: [here on github](https://github.com/MetaMask/metamask-extension/issues/5936), but we get to know the reasons for this non-solvable issue in [this explanation](https://github.com/MetaMask/metamask-extension/issues/5936#issuecomment-755741448).

- For checking if user exists on client end, we check if user.username is not empty or not null, and we do not directly check if user is null or not. That is because mostly, user can be an empty object too, and empty object is considered truthy. So, that check does not tell us if user is actually there or not..

    So, don't remove any of the above checks of user.username..

## Maybe Later

Tasks that are not to be started immediately.

## Can Do

Tasks that can be started by the end of next week. Every week I will check this section and move some tasks into todo.md.
