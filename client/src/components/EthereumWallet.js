import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const EthereumWallet = () => {
    const [error, setError] = useState('');
    const [accounts, setAccounts] = useState(null);

    useEffect(() => {
        if (typeof ethereum === 'undefined') {
            setError('Ethereum not set! Please install Metamask and connect one of your account to this site..');
            return;
        }

        setError('');
        ethereum.on('accountsChanged', (newAccounts) => {
            setAccounts(newAccounts);
        });
    }, []);

    useEffect(() => {
        if (typeof ethereum === 'undefined') {
            return;
        }

        (async () => {
            const tempAccounts = await ethereum.request({ method: 'eth_accounts' });

            if (tempAccounts.length === 0) {
                setError('Accounts disconnected! Please install Metamask and connect one of your account to this site..');
                return;
            }

            setError('');
            setAccounts(tempAccounts);
        })();
    }, [accounts]);

    return (
        <div>
            {error && (
                <h2 style="color: red;">{error}</h2>
            )}

            {accounts && accounts.length > 0 && (
                <h3>{accounts[0]}</h3>
            )}
        </div>
    );
};

export default EthereumWallet;
