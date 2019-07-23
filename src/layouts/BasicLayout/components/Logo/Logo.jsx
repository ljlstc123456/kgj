import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import './Logo.scss';
import img from './logo.png'
export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo">
        <Link to="/project" className="logo-text">
          <img src={img} />
        </Link>
      </div>
    );
  }
}
