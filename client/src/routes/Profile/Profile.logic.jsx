import { useDispatch, useSelector } from "react-redux";

import {
  deleteUserHandler,
  editUserHandler,
} from "../../services/user-routes.service";

import { setError, setMessage, setUser } from "../../store/actions";
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

      dispatch(
        setMessage(
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
