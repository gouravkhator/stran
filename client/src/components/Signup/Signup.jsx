/** @jsx h */
import { h } from "preact";
import SignupLogic from "./Signup.logic";

export default function Signup() {
  const { name, handleSignupFormSubmit, handleNameInput } = SignupLogic();

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
}
