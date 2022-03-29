/** @jsx h */
import { h } from "preact";
import SignupFormLogic from "./SignupForm.logic";

const SignupForm = ({ signupHandler }) => {
  const { name, handleSignupFormSubmit, handleNameInput } = SignupFormLogic({
    signupHandler, // pass this prop to the logical part of SignupForm component
  });

  return (
    <div>
      <form onSubmit={handleSignupFormSubmit}>
        <label for="name">Name:</label>
        <input
          name="name"
          placeholder="Type your name"
          required
          onInput={handleNameInput}
          value={name}
        />

        {/* TODO: Location to be taken by browser current location */}
        {/* TODO: Primary language to be taken as a drop down select menu */}
        {/* TODO: Known languages UI can be like a tag to click on, which selects them as a checkbox list */}

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default SignupForm;
