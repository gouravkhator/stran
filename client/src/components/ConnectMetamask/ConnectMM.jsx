/** @jsx h */
import { h } from "preact";
import ConnectMMLogic from "./ConnectMM.logic";

/**
 * Connect the webapp with MetaMask..
 *
 * Mostly, MetamaskCustomHooks populates the already selected account on Metamask extension.
 * But if no account is connected, then ConnectMM component helps in connecting accounts.
 */
export default function ConnectMM() {
  const { loading, connectMetamask } = ConnectMMLogic();

  return (
    <div>
      <button disabled={loading} onClick={connectMetamask}>
        Connect MetaMask
      </button>
    </div>
  );
}
