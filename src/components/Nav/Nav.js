import React, { Component } from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <nav className="Nav">
        <Link className="Nav__logo" to="/">Cheddify</Link>
        <ul className="Nav__links">
          {/* <li><Link className="Nav__links__link" to="/about">About</Link></li> */}
        </ul>
      </nav>
    );
  }
}

export default Nav;