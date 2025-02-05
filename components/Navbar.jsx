"use client";
import React, { useState, useContext } from "react";

//INTERNAL IMPORTS
import { CrowdFundingContext } from "../context/CrowdFunding";
import { Logo, Menu, Close } from "../components/index";

const Navbar = () => {
  const { currentAccount, connectWallet, setCurrentAccount } =
    useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = ["White paper", "Project", "Donation", "Members"];

  return (
    <div className="backgroundMain">
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-8">
        <div className="relative flex justify-between items-center">
          <div className="flex items-center">
            <a
              href="/"
              aria-label="Company"
              title="Comapny"
              className="inline-flex items-center mr-8"
            >
              <Logo className="w-8" color="text-white" />
              <span className="ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase">
                Company
              </span>
            </a>
            <ul className="flex items-center hidden space-x-8 lg:flex">
              {menuList.map((item, index) => {
                return (
                  <li key={index + 1}>
                    <a
                      href="/"
                      aria-label={item}
                      title={item}
                      className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400"
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {!currentAccount && (
            <ul className="flex items-center hidden space-x-8 lg:flex">
              <li className="">
                <button
                  className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background"
                  onClick={() => connectWallet()}
                  aria-label="sign up"
                  title="sign up"
                >
                  Connect Wallet
                </button>
              </li>
            </ul>
          )}

          <div className="lg:hidden z-40">
            <button
              aria-label="Open menu"
              title="Open menu"
              className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-7" color="text-white" />
            </button>
            {isMenuOpen && (
              <div className="absolute top-0 left-0 w-full">
                <div className="p-5 bg-white border rounded shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <a
                      href="/"
                      aria-label="Company"
                      title="Company"
                      className="inline-flex items-center"
                    >
                      <Logo color="text-black" />
                      <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                        Company
                      </span>
                    </a>
                    <button
                      aria-label="Close menu"
                      title="close menu"
                      className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:outline-none focus:shadow-outline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Close color="text-black" />
                    </button>
                  </div>
                  <nav className="">
                    <ul className="space-y-4">
                      {menuList.map((item, index) => {
                        return (
                          <li key={index + 1}>
                            <a
                              href="/"
                              aria-label={item}
                              title={item}
                              className="font-medium tracking-wide text-gray-500 transition-colors duration-200 hover:text-teal-accent-400"
                            >
                              {item}
                            </a>
                          </li>
                        );
                      })}
                      <li>
                        <a
                          className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none background"
                          href="/"
                          onClick={() => connectWallet()}
                          aria-label="sign up"
                          title="sign up"
                        >
                          Connect Wallet
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
