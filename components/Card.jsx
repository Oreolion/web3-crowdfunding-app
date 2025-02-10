import Image from "next/image";
import React from "react";

const Card = ({ allCampaigns, setOpenModal, setDonate, title, donate }) => {

  const daysLeft = (deadline) => {
    const difference = new Date(Number(deadline)).getTime() - Date.now();
    const remainingDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    return remainingDays.toFixed(0);
  };

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <p className="py-16 text-2xl font-bold leading-5">{title}</p>
      <div  className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {allCampaigns?.map((campaign, i) => {
          return (
            <div
              onClick={() => (setDonate(campaign), setOpenModal(true))}
              key={i + 1}
              className="cursor-pointer overflow-hidden bg-white transition-shadow duration-300 rounded shadow-lg"
            >
              <Image
                src="https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260"
                className="object-cover w-full h-64 rounded"
                alt="image"
                width="64"
                height="64"
              />
              <div className="py-5 pl-2">
                <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                  Days Left: {daysLeft(campaign.deadline)}
                </p>
                <a
                  href="/"
                  aria-label="Article"
                  className="inline-block mb-3 text-black transition-colors duration-200 hover:text-deep-purple-accent-700"
                >
                  <p className="text-2xl font-bold leading-5">
                    {campaign.title}
                  </p>
                </a>
                <p className="mb-4 text-gray-700">{campaign.description}</p>
                <div className="flex space-x-4">
                  <p className="font-semibold">Target: {campaign.target}</p>
                  <p className="font-semibold">
                    Amount Raised: {campaign.amountCollected}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
