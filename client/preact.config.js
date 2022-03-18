export default function (config, env, helpers) {
    config.node.process = 'mock';
    config.node.Buffer = true;

    console.log({env});
    /*const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
    plugin.definitions['process.env.MY_VARIABLE'] = JSON.stringify('my-value');*/
}
