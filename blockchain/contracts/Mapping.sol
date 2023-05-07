// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.25 <0.9.0;

contract Mapping{
    
     mapping(address => bool) public verification;
    function addAddress(address _address) public{
        verification[_address] = true;
    }

    function checkAddress(address _address) public view returns(bool){
        return verification[_address];
    }

}