import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ValentineDay from "./abi/ValentineDay.json";
import "./App.css";

//My generated images
import img1 from "./img/1.png";
import img2 from "./img/2.png";
import img3 from "./img/3.png";
import img4 from "./img/4.png";
import img5 from "./img/5.png";
import img6 from "./img/6.png";
import img7 from "./img/7.png";
import img8 from "./img/8.png";
import img9 from "./img/9.png";
import img10 from "./img/10.png";

import "bootstrap/dist/css/bootstrap.min.css";

//Components import
import Header from "./components/Header";
import Footer from "./components/Footer";

//Address where the contract was deployed
const VDaddress = "0xd3e4470C45c4b4f486F2cd20a84f92965a619e91";

function App() {
  const [error, setError, setErrorColor] = useState("");
  //Retrieves all information about NFTS
  const [data, setData] = useState({});
  const [account, setAccount] = useState([]);

  //Data will be retrieved when the user is logged in
  useEffect(() => {
    fetchData();
    getAccounts();
  }, []);

  async function getAccounts() {
    if (typeof window.ethereum !== "undefined") {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts);
      console.log(accounts[0]);
    }
  }

  async function fetchData() {
    //If the user is well connected with Metamask
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //We retrieve the instance of the contract
      const contract = new ethers.Contract(
        VDaddress,
        ValentineDay.abi,
        provider
      );
      try {
        //We retrieve the price of the NFT
        const cost = await contract.cost();
        //We retrieve the number of NFTS sold
        const totalSupply = await contract.totalSupply();
        const object = { cost: String(cost), totalSupply: String(totalSupply) };
        //We assign the created object to the SetData

        console.log('object', object)
        setData(object);
      } catch (err) {
        console.log('error', err)
        setError("🚨 Connect your Wallet with Ropsten network!🚨");
      }
    }
  }
  //To buy our NFTS
  async function mint() {
    if (typeof window.ethereum !== "undefined") {
      //Recover different accounts
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //Modify data in the blockchain
      const signer = provider.getSigner();
      //We create the instance of the contract
      const contract = new ethers.Contract(VDaddress, ValentineDay.abi, signer);

      try {
        let overrides = {
          from: accounts[0],
          value: data.cost,
        };

        console.log('overrides', overrides)
        const transaction = await contract.mint(accounts[0], 1, overrides);
        await transaction.wait();
        //Update information after transaction
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  }
  //Transfer money from the contract to the contract owner's address
  async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(VDaddress, ValentineDay.abi, signer);

      try {
        const transaction = await contract.withdraw();
        await transaction.wait();
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img1} alt="img1" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img2} alt="img2" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img3} alt="img3" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img4} alt="img4" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img5} alt="img5" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img6} alt="img6" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img7} alt="img7" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img8} alt="img8" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img9} alt="img9" />
            </div>
          </div>
          <div className="col">
            <div className="p-3 border bg-light">
              <img src={img10} alt="img10" />
            </div>
          </div>
        </div>
        <div className="buyNft">
          <h1>Mint a Valentine Day's PopCorn ! 🍿</h1>
          <p className="textColor">
            To use the DApp, you must connect with your Metamask on the Ropsten
            network
          </p>

          <p className="count">{data.totalSupply} / 50</p>
          <p className="cost">
            💲Each PopCorn NFT costs {data.cost / 10 ** 18} eth (excluding gas
            fees)
          </p>
          <button type="button" className="btn btn-danger" onClick={mint}>
            BUY
          </button>
          {account[0] === "0xd39126d40416c72adc67596ea8e9d1171bcecfdd" && (
            <button type="button" className="btn btn-dark" onClick={withdraw}>
              Withdraw
            </button>
          )}
        </div>
        <br></br>
        {error && <p>{error}</p>}
        <Footer />
      </div>
    </div>
  );
}

export default App;
