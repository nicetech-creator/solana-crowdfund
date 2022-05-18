import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Account, Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import CreatForm from './view/createForm';
import Home from './view/home';

import {Wallet} from './components/wallet';
import logo from './logo.svg';
import './App.css';


function App() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  return (
    <div className="App">
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal">Solana-CrowdFund</h5>
        <nav className="my-2 my-md-0 mr-md-3">
        </nav>
        <Wallet/>
      </div>

      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="create" element={<CreatForm />} />
          </Routes>
        </BrowserRouter>
        <footer className="pt-4 my-md-5 pt-md-5 border-top">
          <div className="row">
            <div className="col-12 col-md">
              <img className="mb-2" src="./logo.ico" alt="" width="24" height="24"/>
              <small className="d-block mb-3 text-muted">&copy; 2021</small>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
