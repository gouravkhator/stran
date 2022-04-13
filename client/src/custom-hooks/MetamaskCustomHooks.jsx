import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "preact/hooks";
import { setError, setAccount, setIsInstalled } from "../store/actions";
import { logoutHandler } from "../services/user-auth.service";

export function useMetamask() {
  const accountAddress = useSelector(({ metamask }) => metamask.accountAddress);
  const user = useSelector(({ user }) => user.userdata);

  const dispatch = useDispatch();

  const handleAccountsChanged = async (updatedAccounts) => {
    if (updatedAccounts.length === 0) {
      dispatch(setAccount(null));
      dispatch(
        setError("Please connect this webapp with a Metamask account.."),
      );
      return;
    }

    if (accountAddress !== updatedAccounts[0]) {
      try {
        // send a request to the server to logout the user, if user exists.
        if (!!user.username) {
          await logoutHandler();
        }

        dispatch(setError(null));
        dispatch(setAccount(updatedAccounts[0]));
      } catch (err) {
        // accounts changed, but could not logout, so we cannot show this type of error to user..
        dispatch(setError("Some internal server error occurred"));
      }
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      dispatch(setIsInstalled(false));
      dispatch(
        setError("Please install/enable MetaMask extension to continue."),
      );
      return;
    }

    const ethereum = window.ethereum;

    dispatch(setIsInstalled(true));
    dispatch(setError(null));

    const selectedAddress = ethereum.selectedAddress;

    // as it is a hex value, so it will have prefix of '0x', so its length should be atleast >2
    if (!!selectedAddress && selectedAddress.length > 2) {
      // populate the already selected address if it exists..
      dispatch(setAccount(selectedAddress));
    }

    // on metamask disconnect
    ethereum.on("disconnect", () => {
      dispatch(
        setError(
          "Oops! We are unable to connect to Metamask/Ethereum network..",
        ),
      );
    });

    // on accounts changed, we update the state..
    ethereum.on("accountsChanged", handleAccountsChanged);

    // we can return a cleanup function, which gets called automatically before the component unmounts..
    return function removeListeners() {
      // in removeListener, we need to provide same listener event name with same method..
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [window.ethereum]);
}
