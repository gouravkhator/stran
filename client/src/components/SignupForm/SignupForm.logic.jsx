import { useState } from "preact/hooks";

export default function SignupFormLogic({ signupHandler }) {
  const [name, setName] = useState("");

  const handleSignupFormSubmit = async (event) => {
    try {
      event.preventDefault(); // to force the form not to reload the page

      const username = event.target.name?.value;
      if (!username) {
        setError("Please fill the form properly..");
        return;
      }

      setError("");
      await signupHandler({
        publicAddress: account,
        name: username,
      });
    } catch (err) {
      // TODO: set error accordingly
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
