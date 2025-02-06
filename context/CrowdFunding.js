"use client";
import React, { useState, useEffect } from "react";
import Web3modal from "web3modal";
import { ethers } from "ethers";

//INTERNAL IMPORTS
import { crowdFundingAbi, crowdFundingAddress } from "./constants";

// -- FETCHING THE CONTRACT

const fetchContract = async (signerOrPorvider) => {
  return new ethers.Contract(
    crowdFundingAddress,
    crowdFundingAbi,
    signerOrPorvider
  );
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "CrowdFunding contract";
  const [currentAccount, setCurrentAccount] = useState("");
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState("");

  // -- CREATE CAMPAIGN FUNCTION
  const createCampaign = async (campaign) => {
    try {
      const { title, description, amount, deadline } = campaign;

      if (!window.ethereum) throw new Error("Please install MetaMask!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer); 

      const parsedAmount = ethers.parseUnits(amount, 18);
      const deadlineTimestamp = new Date(deadline).getTime();

      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        parsedAmount,
        deadlineTimestamp
      );
      await transaction.wait();
      console.log("contract call success", transaction);
    } catch (error) {
      console.log("contract call failure", error);
      throw error;
    }
  };

  const getCampaign = async () => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8546");
    const contract = await fetchContract(provider);
    const campaigns = await contract.getCampaigns();
    console.log("campaigns", campaigns);

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    console.log("Contract Address:", crowdFundingAddress);
    console.log("Contract ABI:", crowdFundingAbi);

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8546");
    const contract = await fetchContract(provider);
    console.log("Contract:", contract);
    const allCampaigns = await contract.getCampaigns();
    console.log("All Campaigns:", allCampaigns);

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    const currentUser = accounts[0];

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === currentUser
    );

    const userData = filteredCampaigns.map((campaign, i) => ({
      title: campaign.title,
      owner: campaign.owner,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return userData;
  };

  const donate = async (pId, amount) => {
    const web3modal = new Web3modal();
    const connection = await web3modal.connect();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = await fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });

    await campaignData.wait();
    console.log("donation success", transaction);
    location.reload();

    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new ethers.JsonRpcProvider();
    const contract = await fetchContract(provider);
    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        amount: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  // ---CHECK IF WALLET IS CONNECTED

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("No wallet detected");
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          return true;
        } else {
          console.log("No authorized account found");
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  //-- connect wallet function

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("No wallet detected");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("error connecting to wallet", error);
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        createCampaign,
        getCampaign,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
        currentAccount,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
