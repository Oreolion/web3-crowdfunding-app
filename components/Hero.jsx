"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Arrow, Icon } from "./index";

const Hero = ({ titleData, createCampaign }) => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
  });

  const createNewCampaign = async (e) => {
    e.preventDefault();
    try {
      const data = await createCampaign(campaign);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <span className="coverLine"></span>
      <Image
        className="absolute object-cover"
        layout="fill"
        src="/images/pexels-pixabay-128867.jpg"
        alt="img"
      ></Image>
      <div className="relative bg-opacity-75">
        <Icon />
        <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center justify-between xl:flex-row">
            <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-800 sm:text-5xl sm:leading-none">
                Crypto King <br className="hidden md:block" />
                Crowd Funding CK
              </h2>
              <p className="max-w-xl mb-4 text-xl font-bold text-orange-600 md:text-lg">
                Create a web decentralized campaign and get funded by the
                community for your Web3 projects.
              </p>
              <a
                href="/"
                aria-label=""
                className="inline-flex items-center font-semibold tracking-wider transition-colors duration-200 text-teal-accent-400 hover:text-teal-accent-700 text-black-200"
              >
                Learn more
                <Arrow />
              </a>
            </div>
            <div className="w-full max-w-xl xl:w-5/12">
              <div className="bg-white rounded p-7 shadow-2xl sm:p-10">
                <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
                  Campaign
                </h3>
                <form action="">
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="firstName"
                      className="inline-block mb-1 font-medium"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setCampaign({ ...campaign, title: e.target.value });
                      }}
                      placeholder="title"
                      required
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-blue-accent-400 focus:outline-none focus:shadow-outline"
                      id="firstName"
                      name="firstName"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="lastName"
                      className="inline-block mb-1 font-medium"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setCampaign({
                          ...campaign,
                          description: e.target.value,
                        });
                      }}
                      placeholder="title"
                      required
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-blue-accent-400 focus:outline-none focus:shadow-outline"
                      id="lastName"
                      name="lastName"
                    />
                  </div>

                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      Target Amount
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setCampaign({ ...campaign, amount: e.target.value });
                      }}
                      placeholder="amount"
                      required
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-blue-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="email"
                      className="inline-block mb-1 font-medium"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      onChange={(e) => {
                        setCampaign({ ...campaign, deadline: e.target.value });
                      }}
                      placeholder="date"
                      required
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-blue-accent-400 focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                    />
                  </div>
                  <div className="mt-4 mb-2 sm:mb-4">
                    <button
                      onClick={(e) => createNewCampaign(e)}
                      type="submit"
                      className="inline-flex items-center justify-center font-medium tracking-wide w-full h-12 px-6 text-lg text-white bg-deep-purple-accent-400 rounded shadow-md transitiom duration-200 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none newColor"
                    >
                      Create Campaign
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Create your campaign to raise funds for your project.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
