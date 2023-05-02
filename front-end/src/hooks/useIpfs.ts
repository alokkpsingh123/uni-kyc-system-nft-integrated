import { create, IPFSHTTPClient } from "ipfs-http-client";
import { toastError } from "../utils";

const projectId = "2O441yrdmRZqcjNOG3WrDdk1llH";
const projectSecret = "a99460b1210c3701882d372da01aa1a3";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export const useIpfs = () => {
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
      console.log("useIPFS result : " + result);
      return result;
    } catch (error) {
      toastError("Failed to upload");
    }
  };
  //`https://cors-anywhere.herokuapp.com/https://ipfs.infura.io/ipfs/${path}`
  const getDataFromIpfs = async (path: string) => {
    try {
      const decode = await fetch(`https://ipfs.io/ipfs/${path}`);
      const res = await decode.json();
      console.log("useIPFS decode : " + decode);
      console.log("useIPFS res : " + res);
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
  };
};
