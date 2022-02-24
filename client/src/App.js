import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './components/Header';

// Code-splitting is automated for `routes` directory
import Home from './routes/Home';
import Profile from './routes/Profile';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" />
			<Profile path="/profile/" user="me" />
			<Profile path="/profile/:user" />
		</Router>
	</div>
)

export default App;
