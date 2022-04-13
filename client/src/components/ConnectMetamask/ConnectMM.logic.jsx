import { useDispatch } from "react-redux";
import { useState } from "preact/hooks";
import { setError, setAccount } from "../../store/actions";
import { getErrorObj } from "../../utils/general.util";

export default function ConnectMMLogic() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const connectMetamask = async () => {
    try {
      setLoading((previousLoadingState) => true);

      dispatch(setError(null));

      // TODO: dispatch(setMessage("Please check your Metamask notification for letting the login complete.."));
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

      setLoading((previousLoadingState) => false); // button loading should be false now
    } catch (err) {
      setLoading((previousLoadingState) => false); // button loading should be false now

      if (err?.code === 4001) {
        // these errors are when we click on cancel instead of processing the popup request from Metamask
        dispatch(
          setError("Connect failed as we got a Cancel request from you.."),
        );
      } else {
        dispatch(setError(err.errorMsg ?? null));
      }

      console.error(err);
    }
  };

  return {
    loading,
    connectMetamask,
  };
}
