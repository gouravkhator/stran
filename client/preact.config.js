// import Dotenv from 'dotenv-webpack';

export default function (config) {
    config.node.process = 'mock';
    config.node.Buffer = true;

    // ! ISSUE: the below line didn't help in loading env
    // config.plugins.push(new Dotenv({ path: './.env' }));
}
