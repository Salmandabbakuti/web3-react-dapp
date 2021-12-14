import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers, Contract } from 'ethers';
import './App.css';
import { useEffect, useState } from "react";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

const abi = [{ "inputs": [{ "internalType": "string", "name": "_greeting", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "getGreeting", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_greeting", "type": "string" }], "name": "setGreeting", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

function App() {
  const { active, account, library, chainId, activate, deactivate, error } = useWeb3React();
  const [greeting, setGreeting] = useState('');
  const [contract, setContract] = useState(null);
  const [logMessage, setLogMessage] = useState('');
  const [greetingInput, setGreetingInput] = useState('');

  console.log("active:", active);
  console.log("account:", account);
  console.log("library:", library);
  console.log("chainId:", chainId);

  const connect = () => activate(injected).catch((err) => console.log(err));
  const disconnect = () => deactivate();

  useEffect(() => {
    if (active && chainId === 3) {
      const signer = library.getSigner();
      const contract = new Contract('0x7D18927e96099Ca0C68B9c445744D64A11964D9C', abi, signer);
      setContract(contract);
      contract.getGreeting().then((greeting) => setGreeting(greeting));
    } else {
      console.log("No injected web3 provider found or not connected to ropsten testnet");
    }
  }, [active]);

  useEffect(() => {
    // handle account change
    window.ethereum.on("accountsChanged", async (accounts) => console.log("Accounts change detected:", accounts));

    // handle chain change
    window.ethereum.on("chainChanged", (chainId) => console.log('Chain change detected:', chainId));

    // listen for messages from metamask
    window.ethereum.on('message', (message) => console.log(message));

    // // Subscribe to provider connection
    window.ethereum.on("connect", (info) => console.log('connected to the network:', info));

    // // Subscribe to provider disconnection
    window.ethereum.on("disconnect", (error) => console.log('disconnected from network:', error));
  }, [])

  const submitGreeting = async (e) => {
    e.preventDefault();
    const tx = await contract.setGreeting(greetingInput);
    setLogMessage(`Transaction submitted. Waiting to be mined: ${tx.hash}`);
    await tx.wait().then(async () => {
      setLogMessage('Transaction Succeded..');
      setGreeting(await contract.getGreeting());
    });
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{greeting}</h1>
        {active ?
          <button onClick={disconnect}>Disconnect</button> : <button onClick={connect}>Connect</button>
        }
        <form onSubmit={(e) => submitGreeting(e)}>
          <label>
            <h4>Greeting</h4>
            <input type="text" name="name" placeholder="Write your greeting here.." onChange={(e) => setGreetingInput(e.target.value)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {error && <div>{error.message}</div>}
      </header>
      <p className="App-log">{logMessage}</p>
    </div>
  );
}

export default App;
