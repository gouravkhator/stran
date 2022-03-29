import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "preact/hooks";
import { setError, setAccount, setIsInstalled } from "../store/actions";

export function useMetamask() {
  const accountAddress = useSelector(({ metamask }) => metamask.accountAddress);
  const dispatch = useDispatch();

  const handleAccountsChanged = (updatedAccounts) => {
    if (updatedAccounts.length === 0) {
      dispatch(setAccount(null));
      dispatch(
        setError("Please connect this webapp with a Metamask account.."),
      );
      return;
    }

    if (accountAddress !== updatedAccounts[0]) {
      // TODO: send a request to the server to logout the user.

      dispatch(setError(null));
      dispatch(setAccount(updatedAccounts[0]));
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      dispatch(setIsInstalled(false));
      dispatch(setError("Please install MetaMask to continue.."));
      return;
    }

    dispatch(setIsInstalled(true));
    dispatch(setError(null));

    // on metamask disconnect
    ethereum.on("disconnect", () => {
      setError(
        "Some issues occurred, we are unable to connect to Metamask/Ethereum network..",
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
