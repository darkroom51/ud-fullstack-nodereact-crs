import React from 'react';

class Header extends React.Component {
	render() {
		return (
			<nav>
				<div className="nav-wrapper">
					<a href="/" className="brand-logo">Emaily</a>
					<ul id="nav-mobile" className="right hide-on-med-and-down">
						<li><a href="/auth/google">Login</a></li>
					</ul>
				</div>
			</nav>
		)
	}
}

export default Header;