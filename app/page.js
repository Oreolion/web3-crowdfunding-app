"use client";
import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORTS

import { CrowdFundingContext } from "@/context/CrowdFunding";
import { Hero, Card, PopUp } from "@/components/index";

export default function Home() {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaign, setUserCampaign] = useState([]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const allData = await getCampaigns();
        const userData = await getUserCampaigns();

        setAllCampaigns(allData);
        setUserCampaign(userData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [getCampaigns, getUserCampaigns]);


  //   DONATE POPUP MODAL
  const [openModal, setOpenModal] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  return (
    <div className="">
      <Hero title={titleData} createCampaign={createCampaign} />
      {allCampaigns.length > 0 ? (
        <Card
          title="All Campaigns"
          allCampaigns={allCampaigns}
          donate={donate}
          setOpenModal={setOpenModal}
          setDonate={setDonateCampaign}
        />
      ) : (
        <p>Loading campaigns...</p>
      )}
      {userCampaign.length > 0 ? (
        <Card
          title="Your created Campaigns"
          allCampaigns={userCampaign}
          setOpenModal={setOpenModal}
          setDonate={setDonateCampaign}
        />
      ) : (
        <p className="text-center mx-auto p-4">No campaigns found.</p>
      )}

      {openModal && (
        <PopUp
          setOpenModal={setOpenModal}
          donateCampaign={donateCampaign}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </div>
  );
}
