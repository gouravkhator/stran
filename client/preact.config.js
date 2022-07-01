import envVars from 'preact-cli-plugin-env-vars';
 
export default function (config, env, helpers) {
  config.node.process = "mock";
  config.node.Buffer = true;

  envVars(config, env, helpers);
}
