import { useDispatch } from "react-redux";
import { useState } from "preact/hooks";
import { setError, setAccount, setMessage } from "../../store/actions";
import { getErrorObj } from "../../utils/general.util";

export default function ConnectMMLogic() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const connectMetamask = async () => {
    try {
      setLoading((previousLoadingState) => true);

      dispatch(setError(null));
      dispatch(
        setMessage(
          "Please check your Metamask notification for letting the login complete..",
        ),
      );

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw getErrorObj({
          errorMsg: "No accounts selected for connecting with Metamask",
          shortErr: "no-accounts-selected",
        });
      }

      let accountAddress = accounts[0];

      // sets account address and by default, this also sets metamask connected state too
      dispatch(setAccount(accountAddress));
      dispatch(setError(null));
      dispatch(setMessage(null));

      setLoading((previousLoadingState) => false); // button loading should be false now
    } catch (err) {
      dispatch(setMessage(null));
      setLoading((previousLoadingState) => false); // button loading should be false now

      if (!err) {
        return;
      }

      if (err?.code === 4001) {
        // these errors are when we click on cancel instead of processing the popup request from Metamask
        dispatch(
          setError("Connect failed as we got a Cancel request from you.."),
        );
      } else {
        dispatch(
          setError(
            err.errorMsg ??
              "Some issues occurred with Connecting to MetaMask!! Please check if there are any pending notifications in your MetaMask wallet, and try to resolve them before clicking on Connect here",
          ),
        );
      }
    }
  };

  return {
    loading,
    connectMetamask,
  };
}
