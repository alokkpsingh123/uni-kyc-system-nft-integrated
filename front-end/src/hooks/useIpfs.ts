import { create, IPFSHTTPClient } from "ipfs-http-client";
import { toastError } from "../utils";
import { useState } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useApi } from "./useApi";

require("dotenv").config();

const projectId = "2O441yrdmRZqcjNOG3WrDdk1llH";
const projectSecret = "a99460b1210c3701882d372da01aa1a3";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret,'utf8').toString('base64');

export const useIpfs = () => {
  // const [image, setImage] = useState("");
  // const [description, setDescription] = useState("");
  const { mint } = useApi();
  //   console.log(process.env.API_URL);
  // const web3 = createAlchemyWeb3(API_URL);
  // const contractAddress = "0x4E675cA8903c43e67eEA700e250097eAd1D40171";
  // const nft = new web3.eth.Contract(contract.abi, contractAddress);

  // console.log(web3.eth.getBlockNumber());

  let ipfs: IPFSHTTPClient | undefined;
  (() => {
    try {
      ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });
    } catch (error) {
      toastError("IPFS failure");
      ipfs = undefined;
    }
  })();

  const upload = async (data: any) => {
    try {
      const result = await (ipfs as IPFSHTTPClient).add(data);
      console.log(result.path);
      // setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      return result;
    } catch (error) {
      toastError("Failed to upload");
    }
  };

  const createNFT = async (recipient: string, name: string, image: string) => {
    if (!image || !name) return;
    try {
      const result = await (ipfs as IPFSHTTPClient).add(
        JSON.stringify({ name, image })
      );
      mintFn(result, recipient);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };

  const mintFn = async (result: any, recipient: string) => {
    try {
      const uri: string = `https://unikyc.infura-ipfs.io/ipfs/${result.path}`;
      // mint nft
      const tokenId = await mint(recipient, uri);
      return tokenId;
      // get tokenId of new nft
    } catch (error) {
      console.log("Failed to mint the nft");
      toastError("Failed to mint the NFT");
    }
  };

  //`https://cors-anywhere.herokuapp.com/https://ipfs.infura.io/ipfs/${path}`

  
  const getDataFromIpfs = async (path: string) => {
    try {
      console.log(path);
      const decode = await fetch(`https://unikyc.infura-ipfs.io/ipfs/${path}`);
      console.log(decode.status);
      console.log(decode);
      console.log(decode.url);
      const res = await decode.json();
      
      console.log(res);
      if (res) {
        return res;
      } else {
        toastError("data not found");
        return "";
      }
    } catch (error) {
      toastError("Failed to fetch data from ipfs");
    }
  };

  return {
    upload,
    getDataFromIpfs,
    createNFT,
  };
};

//api key: 7ec9687ad7e8647a06b4
//api secret: a1189e0ea34f1bd76f7499a25b92eb1d466588e416318312d07d4e78d6ea750a

// API Key: 7ec9687ad7e8647a06b4
//  API Secret: a1189e0ea34f1bd76f7499a25b92eb1d466588e416318312d07d4e78d6ea750a
//  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzOWUxNzQ2OS00ZDM5LTQ1ZjctOThlYy0xNmMxOTJiMDljMDgiLCJlbWFpbCI6ImFsb2trcHNpbmdoMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3ZWM5Njg3YWQ3ZTg2NDdhMDZiNCIsInNjb3BlZEtleVNlY3JldCI6ImExMTg5ZTBlYTM0ZjFiZDc2Zjc0OTlhMjViOTJlYjFkNDY2NTg4ZTQxNjMxODMxMmQwN2Q0ZTc4ZDZlYTc1MGEiLCJpYXQiOjE2ODMzOTg4MzF9.F0xfwFNCTNssBP4R2jOevuFws2BRNKbTmqCnkJVZPNs
// import axios from "axios";
// import FormData from "form-data";
// import { toastError, toastSuccess } from "../utils";

// export const useIpfs = () => {
//   const upload = async (file: any) => {
//     if (file) {
//       try {
//         const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
//         const data = new FormData();
//         data.append("file", file);
//         // const data = Buffer.from(JSON.stringify(file));
//         console.log("kem partyyy " + file);

//         const res = await axios.post(url, data, {
//         //   maxContentLength: Infinity,
//           headers: {
//             "Content-Type": `multipart/form-data;}`,
//             // 'Content-Type': 'application/json',
//             pinata_api_key: "7ec9687ad7e8647a06b4",
//             pinata_secret_api_key:
//               "a1189e0ea34f1bd76f7499a25b92eb1d466588e416318312d07d4e78d6ea750a",
//           },
//         });

//         const imgUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
//         console.log("ImgHash: " + imgUrl);
//         toastSuccess("Successfully Image Uploaded");
//         return res.data;
//       } catch (e) {
//         toastError("Unable to upload image to Pinata");
//       }
//     }

//   };

//   const getDataFromIpfs = async (path: string) => {
//     try {
//       const decode = await fetch(`https://gateway.pinata.cloud/ipfs/${path}`);
//       const res = await decode.json();
//       console.log("useIPFS decode : " + decode);
//       console.log("useIPFS res : " + res);
//       if (res) {
//         return res;
//       } else {
//         toastError("data not found");
//         return "";
//       }
//     } catch (error) {
//       toastError("Failed to fetch data from ipfs");
//     }
//   };

//   return {
//     upload,
//     getDataFromIpfs,
//   };
// };
