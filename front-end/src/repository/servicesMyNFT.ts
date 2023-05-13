import { Contract, ethers, utils } from "ethers";
import { MyNFT_ADDRESS} from "./config";
import { getCurrentEpoch } from "../utils";

declare let window: any;
let MyNFTContractABI = require("./MyNFT.json");

export class NftServices {
    private static instance: NftServices;
    private _NftContract!: Contract;
    private _accountAdress: string | undefined;
    static eventContract: Contract;
}
