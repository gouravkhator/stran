# INBOX -- Track Features/Things to note down

## Inbox -- Collect whatever stuff

### Info To Be Noted for future

- 

### Check and Research

- [ ] What server does torrent use out of STUN and TURN, to make a peer network ?
- [ ] 

## Bugs that are not easily fixable as of now

### Client End Only

- [ ] When we toggle video off, then also the camera light is on.

    * Code block for current approach:
    ```js
    const videoTrack = localStream
        .getTracks()
        .find((track) => track.kind === "video");

    if (webcamOn === true) {
      // turn the webcam off, meaning disable the video tracks of the local stream
      videoTrack.enabled = false;
    } else {
      videoTrack.enabled = true; // enable the video track..
    }
    ```

    * But, this just sends the black frame to the client side, and keeps the camera light on.
        
        Refer the article on the same issue faced in previous versions of [Agora Video SDK FAQ section](https://docs.agora.io/en/All/faq/web_camera_light).

        They say that if we close the stream, then the audio track also gets closed. 
    * This can only be avoided when we publish the audio and video track as separate objects, enabling you to disable the local video and turn off the camera light by using the `close` method of the video track object, without affecting the audio track.

## OKR -- The Objective Keys and Results

Monthly ammended. With all its history.

## Don't Do

Anything not meeting the current OKR. You may repeatedly come up with the same idea once in a long period, with the same time-wasting procedures to deal with it. So the best solution is just to write it down as a notice.

- We cannot check the metamask disabled/uninstalled/installed state without the webapp refresh.

    - `ISSUE`: When metamask is disabled/uninstalled, we cannot listen to those events. When I refresh the page, then it detects that window.ethereum is not defined, so it throws valid error to the user. Similar is the case while installing of extension too.

    - This is an already `OPEN` existing issue in metamask extension: [here on github](https://github.com/MetaMask/metamask-extension/issues/5936), but we get to know the reasons for this non-solvable issue in [this explanation](https://github.com/MetaMask/metamask-extension/issues/5936#issuecomment-755741448).

- For checking if user exists on client end, we check if `user.username` is not empty or not null, and we do not directly check if user is null or not.
    
    - That is because mostly, user can be an empty object too, and empty object is considered truthy. So, that check does not tell us if user is actually there or not..
    - So, don't remove any of the above checks of `user.username`..

## Maybe Later

Tasks that are not to be started immediately.

## Can Do

Tasks that can be started by the end of next week. Every week I will check this section and move some tasks into todo.md.
