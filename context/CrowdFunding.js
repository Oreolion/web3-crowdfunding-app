"use client";
import React, { useState, useEffect } from "react";
import Web3modal from "web3modal";
import { ethers } from "ethers";

//INTERNAL IMPORTS
import { crowdFundingAbi, crowdFundingAddress } from "./constants";

// -- FETCHING THE CONTRACT

const fetchContract = async (signerOrProvider) => {
  return new ethers.Contract(
    crowdFundingAddress,
    crowdFundingAbi,
    signerOrProvider
  );
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "CrowdFunding contract";
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState("");

  //   CREATE CAMPAIGN FUNCTION
  const createCampaign = async (campaign) => {
    try {
      setIsLoading(true);
      const { title, description, amount, deadline } = campaign;
      const web3modal = new Web3modal();
      const connection = await web3modal.connect();
      provider = new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);

      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      );

      await transaction.wait();
      console.log("Campaign created successfully:", transaction);
    } catch (error) {
      console.error("Error creating campaign:", error);
      setError(error.message);
      setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaigns = async () => {
     const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

    const contract = await fetchContract(provider);
    const campaigns = await contract.getCampaigns();
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
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

    const contract = await fetchContract(provider);
    const allCampaigns = await contract.getCampaigns();

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
    const provider = new ethers.providers.Web3Provider(connection);
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
    const provider = new ethers.providers.Web3Provider();
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
        getCampaigns,
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
