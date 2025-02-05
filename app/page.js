"use client";
import React, { useState, useEffect, useContext, use } from "react";

//INTERNAL IMPORTS

import { CrowdFundingContext } from "@/context/CrowdFunding";
import { Hero, Card, PopUp } from "@/components/index";

export default function Home() {
  const {
    titleData,
    getCampaign,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaign, setUserCampaign] = useState();
  useEffect(() => {
    const getCampaignsData = getCampaign();
    const userCampaignsData = getUserCampaigns();
    return async () => {
      const allData = await getCampaignsData;
      const userData = await userCampaignsData;
      setAllCampaigns(allData);
      setUserCampaign(userData);
    };
  }, []);

  //   DONATE POPUP MODAL
  const [openModal, setOpenModal] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  return (
    <div className="container">
      <Hero title={titleData} createCampaign={createCampaign} />
      <Card
        title="All Campaigns"
        allcampaign={allCampaigns}
        donate={donate}
        setOpenModal={setOpenModal}
        setDonate={setDonateCampaign}
      />
      <Card
        title="Your created Campaigns"
        allcampaign={userCampaign}
        setOpenModal={setOpenModal}
        setDonate={setDonateCampaign}
      />

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
