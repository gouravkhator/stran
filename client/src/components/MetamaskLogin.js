import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import UserAuth from './UserAuth';

const MetamaskLogin = () => {
    const [error, setError] = useState('');
    const [account, setAccount] = useState('');

    const handleAccountsChanged = (updatedAccounts) => {
        if (updatedAccounts.length === 0) {
            setAccount('');
            setError('Please connect this dapp with a Metamask account..');
            return;
        }

        if (account !== updatedAccounts[0]) {
            // TODO: invalidate token and also logout the user.

            setAccount(updatedAccounts[0]);
        }
    }

    useEffect(() => {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            setError('Please install MetaMask first.');
            return;
        }

        setError('');

        // on metamask disconnect
        ethereum.on('disconnect', () => {
            console.log('Some issues occurred, we are unable to connect to Metamask/Ethereum network..');
        });

        // on accounts changed, we update the state..
        ethereum.on('accountsChanged', handleAccountsChanged);

        // we can return a cleanup function, which gets called automatically before the component unmounts..
        return function removeListeners() {
            // in removeListener, we need to provide same listener event name with same method..
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
    }, []);

    return (
        <div>
            {error && (
                <p style="color: red;">{error}</p>
            )}

            {ethereum && (
                <UserAuth ethereum={ethereum}
                    account={account}
                    setAccount={setAccount}
                    setError={setError}
                />
            )}
        </div>
    );
};

export default MetamaskLogin;
