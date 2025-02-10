"use client";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers, BrowserProvider, parseEther } from "ethers";

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

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();

      // Fetch the contract instance
      const contract = await fetchContract(signer);

      // Create the campaign
      const transaction = await contract.createCampaign(
        signer.address, // Replaces currentAccount
        title,
        description,
        ethers.parseUnits(amount, 18),
        Math.floor(new Date(deadline).getTime() / 1000)
      );

      await transaction.wait();
      console.log("✅ Campaign created successfully:", transaction);
    } catch (error) {
      console.error("❌ Error creating campaign:", error);
      setError(error.message);
      setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaigns = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const contract = await fetchContract(provider);
      const campaigns = await contract.getCampaigns();

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.formatEther(campaign.target),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.formatEther(campaign.amountCollected),
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error("Error getting campaigns:", error);
      setError(error.message);
      setOpenError(true);
      return [];
    }
  };

  const getUserCampaigns = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const contract = await fetchContract(provider);
      const allCampaigns = await contract.getCampaigns();

      let accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      const currentUser = accounts[0];

      const filteredCampaigns = allCampaigns.filter(
        (campaign) => campaign.owner.toLowerCase() === currentUser.toLowerCase()
      );

      const userData = filteredCampaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.formatEther(campaign.target),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.formatEther(campaign.amountCollected),
        pId: i,
      }));

      return userData;
    } catch (error) {
      console.error("Error getting user campaigns:", error);
      setError(error.message);
      setOpenError(true);
      return [];
    }
  };

  const donate = async (pId, amount) => {
    try {
      if (typeof pId !== "number" || pId < 0)
        throw new Error("Invalid campaign ID.");
      if (!amount || isNaN(amount) || Number(amount) <= 0)
        throw new Error("Invalid donation amount.");

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = await fetchContract(signer);

      const transaction = await contract.donateToCampaign(pId, {
        value: parseEther(amount.toString()),
      });

      await transaction.wait();
      console.log("Donation successful:", transaction);
      location.reload();
      return transaction;
    } catch (error) {
      console.error("Error donating to campaign:", error.message);
      setError(error.message);
      setOpenError(true);
    }
  };

  const getDonations = async (pId) => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const contract = await fetchContract(provider);
      const donations = await contract.getDonators(pId);
      const numberOfDonations = donations[0].length;
      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          amount: ethers.formatEther(donations[1][i].toString()),
        });
      }

      return parsedDonations;
    } catch (error) {
      console.error("Error getting donations:", error);
      setError(error.message);
      setOpenError(true);
      return [];
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setOpenError(true);
        setError("No wallet detected");
        return false;
      }

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
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setOpenError(true);
        setError("No wallet detected");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError(error.message);
      setOpenError(true);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
        isLoading,
        error,
        openError,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
