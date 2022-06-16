import { useDispatch, useSelector } from "react-redux";

import {
  deleteUserHandler,
  editUserHandler,
} from "../../services/user-routes.service";

import {
  setBannerMsg,
  setError,
  setMessage,
  setUser,
} from "../../store/actions";
import { getErrorObj } from "../../utils/general.util";

export default function ProfileLogic() {
  const dispatch = useDispatch();
  const metamaskAcc = useSelector(({ metamask }) => metamask.accountAddress);

  const deleteAccount = async () => {
    try {
      const { deletedUser } = await deleteUserHandler();

      if (deletedUser === false) {
        throw getErrorObj({
          errorMsg: "Cannot delete the account. Please try again later..",
          shortErr: "delete-err",
        });
      }

      dispatch(setUser(null)); // set the redux stored userdata to null

      /**
       * This delete button deletes the user and redirects to the home page directly..
       * So, we set the banner message, that will be shown in the home page for 5 seconds,
       * and then it will be set to empty string..
       *
       * Q) Why we don't set the global 'message' here instead of 'bannerMsg'?
       * > It is bcoz, I want to store page specific errors and messages to not overflow to other pages/routes.
       * Secondly, in the home page, I don't want to show any error or message.
       * But the banner message is one thing, which I only want in the home page, and that too for 5 seconds.
       */
      dispatch(
        setBannerMsg(
          "A warm goodbye to you!! Thank you for being a part of this family.",
        ),
      );
    } catch (err) {
      if (!err) {
        return;
      }

      // if error occurs, we either show our own error message or if some internal error occurred, then errorMsg field is not set..
      // then we show some other error message like "Cannot delete".
      dispatch(
        setError(
          err.errorMsg ?? "Cannot delete the account. Please try again later..",
        ),
      );
    }
  };

  const editProfile = async () => {
    try {
      const updatedUser = await editUserHandler({
        publicAddress: metamaskAcc,
        // TODO: pass the other params via the state
      });

      dispatch(setUser(updatedUser));

      dispatch(
        setMessage(
          "Fantaordinary! You successfully edited your personal details..",
        ),
      );
    } catch (err) {
      if (!err) {
        return;
      }

      // if error occurs, we either show our own error message or if some internal error occurred, then errorMsg field is not set..
      // then we show some other error message like "Cannot update the details".
      dispatch(
        setError(
          err.errorMsg ?? "Cannot update the details. Please try later..",
        ),
      );
    }
  };

  return {
    deleteAccount,
    editProfile,
  };
}
