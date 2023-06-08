import React from 'react';
import logo from '../logo.svg';

export function Loading() {
  return (
    <div className="App-loading">
      <img src={logo} className="App-loader" alt="logo" />
    </div>
  );
}
