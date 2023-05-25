import Web3 from "web3";
import { NFTCONTRACT_ADDRESS } from "./config";
import { Contract } from "web3-eth-contract";
// import { ethers } from "ethers";
// import { Contract } from "ethers";

declare let window: any;
let ABI = require("./ABI.json");
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

export class NftServices {
  private static instance: NftServices;
  private contract!: Contract;
  private web3 = new Web3();
  // private PRIVATE_KEY =
  //   "4ccab8d161e3f07fb5338aaf36899e8099c907c9c4ee5aa9ec893ef05f360ef4";

  public static getInstance(): NftServices {
    if (!NftServices.instance) {
      NftServices.instance = new NftServices();
    }
    return NftServices.instance;
  }

  checkedWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return false;
      }
      await ethereum.enable();
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();

      // window.ethereum.on("chainChanged", (chainId: number) => {
      //   window.location.reload();
      // });

      // this.contract = new ethers.Contract(NFTCONTRACT_ADDRESS, ABI["abi"], signer);

      // console.log(this.contract);

      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      this.contract = new this.web3.eth.Contract(ABI.abi, NFTCONTRACT_ADDRESS);
      console.log(this.contract);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  async ethEnabled() {
    return await this.checkedWallet();
  }

  async mint(recipientAddress: string, tokenURI: string) {
    await this.ethEnabled();

    try {
      const accounts = await this.web3.eth.getAccounts();
      console.log("account[0]: " + accounts[0]);
      const data = await this.contract.methods
        .mint(recipientAddress, tokenURI)
        .send({ from: accounts[0] });
      // this.contract.tokenCount();
      // console.log("==>Address:", data?.events?.Transfer?.address);
      // console.log("==>TokenId", data?.events?.Transfer?.returnValues?.tokenId); //[object object]
      // console.log("==>TransactionHash:", data?.transactionHash); //[object object]
      return data;
    } catch (error) {
      console.log("error", error);
      return false;
    }

    // try {
    //   await this.ethEnabled();
    //   await (
    //     await this.contract.methods.mint(recipientAddress, tokenURI)
    //   ).wait();
    //   const id = this.contract.tokenCount();
    //   console.log("tokenId after minting nft:" + id);
    //   return true;
    // } catch (error) {
    //   throw error;

    // }

    // await this.ethEnabled();
    // const nonce = await this.web3.eth.getTransactionCount(
    //   recipientAddress,
    //   "latest"
    // );
    // const tx = {
    //   from: recipientAddress,
    //   to: NFTCONTRACT_ADDRESS,
    //   nonce: nonce,
    //   gas: 500000,
    //   data: this.contract.methods.mint(recipientAddress, tokenURI).encodeABI(),
    // };
    // const signPromise = this.web3.eth.signTransaction(tx, this.PRIVATE_KEY!);

    // signPromise
    //   .then((signedTx) => {
    //     this.web3.eth.sendSignedTransaction(signedTx.raw, function (err, hash) {
    //       if (!err) {
    //         console.log(
    //           "The hash of your transaction is: ",
    //           hash,
    //           "\nCheck Alchemy's Mempool to view the status of your transaction!"
    //         );
    //       } else {
    //         console.log(
    //           "Something went wrong when submitting your transaction:",
    //           err
    //         );
    //       }
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(" Promise failed:", err);
    //   });

    //   signPromise
    //     .then((signedTx) => {
    //       const sentTx = this.web3.eth.sendSignedTransaction(signedTx.raw);
    //       sentTx.on("receipt", (receipt) => {
    //         console.log("receipt: " + receipt);
    //       });
    //       sentTx.on("error", (err) => {
    //         console.log("error: " + err);
    //       });
    //     })
    //     .catch((err) => {
    //       console.log("Promise failed");
    //     });
  }
}
