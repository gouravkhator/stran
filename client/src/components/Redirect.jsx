import { Component } from "preact";
import { route } from "preact-router";

/**
 * Redirect component is not built-in preact-router,
 * so we made our own Redirect component as a helper component
 */
export default class Redirect extends Component {
  componentWillMount() {
    route(this.props.to, true);
  }

  render() {
    return null;
  }
}
