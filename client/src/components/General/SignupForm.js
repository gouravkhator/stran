import { h } from 'preact';
import { useState } from 'preact/hooks';

const SignupForm = ({ signupHandler }) => {
    const [name, setName] = useState('');

    const handleSignupFormSubmit = async (event) => {
        try {
            event.preventDefault(); // to force the form not to reload the page

            const username = event.target.name?.value;
            if (!username) {
                setError('Please fill the form properly..');
                return;
            }

            setError('');
            await signupHandler({
                publicAddress: account,
                name: username,
            });
        } catch (err) {
            // TODO: set error accordingly
        }
    }

    return (
        <div>
            <form onSubmit={(event) => handleSignupFormSubmit(event)}>
                <label for="name">Name:</label>
                <input name="name" placeholder="Type your name" required
                    onChange={(event) => setName(event.value)}
                    value={name} />

                {/* TODO: Location to be taken by browser current location */}
                {/* TODO: Primary language to be taken as a drop down select menu */}
                {/* TODO: Known languages UI can be like a tag to click on, which selects them as a checkbox list */}

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default SignupForm;
