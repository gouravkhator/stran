import { h } from 'preact';
import style from '../styles/home.style.css';
import Calling from '../components/Calling';
import EthereumWallet from '../components/EthereumWallet';

const Home = () => {
    // ! ISSUE: style is an empty object, not just in this component, but in entire preact application. It is bcoz I moved the styles to other folder, not like preact default folder structure.
    return (
        <div class={style.home}>
            <EthereumWallet />
            <Calling />
        </div>
    );
};

export default Home;
