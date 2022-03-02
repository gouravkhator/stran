export async function getUserByToken() {
    try {
        const result = await fetch(`http://localhost:8081/user`, {
            method: 'GET',
            credentials: 'include',
            // this sends the credentials like cookies, and other sensitive info in the headers in a secure way
        });

        const data = await result.json();
        return data.user ?? null;
    } catch (err) {
        return null;
    }
}

export async function fetchNonce(publicAddress) {
    const result = await fetch(`http://localhost:8081/auth/nonce/${publicAddress}`, {
        method: 'GET',
        credentials: 'include',
    });

    const data = await result.json();

    if (data.success === true && data.nonce !== null) {
        return data.nonce;
    }

    return null;
}

export async function signupHandler({
    publicAddress,
    name,
    // primaryLocation,
    // primaryLanguage,
    // knownLanguages,
}) {
    const result = await fetch('http://localhost:8081/auth/signup', {
        body: JSON.stringify({
            publicAddress,
            name,
            // primaryLocation,
            // primaryLanguage,
            // knownLanguages,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
    });

    const data = await result.json();
    if (data.success === true) {
        return data.user;
    }

    return null;
}

export async function verifySignatureHandler({
    publicAddress,
    signature,
}) {
    const result = await fetch('http://localhost:8081/auth/verify', {
        body: JSON.stringify({
            publicAddress,
            signature,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
    });

    const data = await result.json();
    if (data.verified === true) {
        // if the verified is true, the token is saved in the cookie already, from the server end.
        return data.user;
    }

    return null;
}
