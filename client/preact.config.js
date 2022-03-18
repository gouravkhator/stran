export default function (config, env, helpers) {
  config.node.process = "mock";
  config.node.Buffer = true;

  /**
   * Defining the env loading code as below..
   * TODO: Have to test out the below code for env loading
   */
  /*
    const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
    plugin.definitions['process.env.MY_VARIABLE'] = JSON.stringify('my-value');
    */
}
