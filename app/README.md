# Stran Frontend with React Native

This branch `react-native-experimental` is created for saving the react-native incomplete code. When I successfully build the p2p video calling using vanilla JS, then I will try to implement that in react-native too.

## Some Important Notes before starting off:

* > ⚠️ 🧐 There are some issues while I run the app, tried reinstalling and installing and copying previous files. The app is not loading when tried on a physical device. When I open that up, it just automatically closes again. It was running fine before. 

* **Note: There were some issues with Node version 17.3.0, as some React-Native packages were erroring out, so I removed node_modules folder and package-lock.json file and used node version 16.13.0**

    We can use nvm for various node version management.

* > Hoping that all npm packages were already installed, from full-install npm script, when run from the project's root folder.

## Resourceful Links for Setup

* [Installing important dependencies](https://reactnative.dev/docs/environment-setup#installing-dependencies)

* [Setting up Android device for debugging](https://reactnative.dev/docs/running-on-device#running-your-app-on-android-devices)

* [Run and debug the app on Physical device, which is connected over same network](https://reactnative.dev/docs/running-on-device#method-2-connect-via-wi-fi-2)

---

## Hybrid Dev Ninja Tactics for *GeekyNinjas*

* If you have installed/removed some packages from npm, or you have added some config, then you need to connect the android device once again via usb and then first type:

    ```bash
    adb devices
    ```

    This should show the device ID, which is currently connected. If it doesn't show, we can try reconnecting the device via usb.

    Once it shows in the adb devices list, we then type:

    ```bash
    npm run android
    ```

    This above command builds the new packages and removes old packages. It configures on the android device, any changes we configured in the project.

    Then, we can wirelessly run the app via Metro server as explained below.

* Run the Metro Server in one terminal session:

    ```bash
    npm start
    ```

* Building the app on android:

    ```bash
    npm run android
    ```

* Building the app on ios:

    \***Note\*: Below command works only for MAC users..**

    ```bash
    npm run ios
    ```

* react-native-vector-icons icons not loading in the app:

    We have to add the following line in `<project_root_folder>`/app/android/app/build.gradle:

    ```bash
    apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
    ```

    And then rebuild the app again.

* Setting up web3.js in react native:

    Check the solution [here](https://ethereum.stackexchange.com/questions/46239/using-web3-1-0-with-react-native/68986#68986)
