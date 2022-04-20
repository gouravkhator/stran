import { useState } from "preact/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setError, setMessage } from "../../store/actions";
import { getErrorObj } from "../../utils/general.util";

import { signupHandler } from "../../services/user-auth.service";

/**
 * As sign up logic involves more user inputs than Login,
 * so we want user to have the prerequisite of staying connected with Metamask..
 *
 * And after creating the account, user has to login to continue..
 */
export default function SignupLogic() {
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const metamaskAcc = useSelector(({ metamask }) => metamask.accountAddress);

  const handleSignupFormSubmit = async (event) => {
    try {
      event.preventDefault(); // to force the form not to reload the page

      const username = event.target.name?.value;

      if (!username) {
        throw getErrorObj({
          errorMsg: "Please type your name to continue..",
          shortErr: "name-required",
        });
      }

      /**
       * Although the signup route in server end checks for valid blockchain account address,
       * then also we check in the client end and only proceed if it is set..
       */
      if (!metamaskAcc) {
        throw getErrorObj({
          errorMsg: "Please connect your Metamask account to continue..",
          shortErr: "no-accounts-connected",
        });
      }

      dispatch(setError(null));

      await signupHandler({
        publicAddress: metamaskAcc,
        name: username,
      });

      dispatch(setMessage("Hurray! you successfully created the account. Please login now to continue.."));
    } catch (err) {
      dispatch(setError(err.errorMsg ?? null));
    }
  };

  const handleNameInput = (event) => {
    setName((previousName) => event.value);
  };

  return {
    name,
    handleSignupFormSubmit,
    handleNameInput,
  };
}
