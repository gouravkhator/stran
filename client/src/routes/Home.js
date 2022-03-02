import { h } from 'preact';
import style from '../styles/home.style.css';
import Calling from '../components/Calling';
import MetamaskLogin from '../components/MetamaskLogin';

const Home = () => {
    // ! ISSUE: style is an empty object, not just in this component, but in entire preact application. It is bcoz I moved the styles to other folder, not like preact default folder structure.
    return (
        <div class={style.home}>
            <MetamaskLogin />
            {/* Commented the Calling Component, to only include that in the calling page */}
            {/* <Calling /> */}
        </div>
    );
};

export default Home;
