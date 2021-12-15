import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core'
import './index.css';
import App from './App';
import { ethers } from 'ethers';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={(provider) => new ethers.providers.Web3Provider(provider)}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
