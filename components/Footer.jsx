import React from "react";

const Footer = () => {
  const productList = ["Market", "ERC20", "token", "Donation"];
  const usefulLinks = ["Home", "About us", "Company Bio"];
  const contactlist = ["suppport@crypto.com", "info@example.com", "Contact Us"];

  return (
    <footer className="text-center text-white backgroundMain lg:text-left">
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h6 className="mb-4 flex items-center justify-center uppercase text-2xl font-semibold md:justify-start">
              Product
            </h6>
            <ul className="mt-4">
              {productList.map((item, index) => (
                <li key={index} className="my-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Useful Links</h3>
            <ul className="mt-4">
              {usefulLinks.map((item, index) => (
                <li key={index} className="my-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Contact</h3>
            <ul className="mt-4">
              {contactlist.map((item, index) => (
                <li key={index} className="my-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Address</h3>
            <p className="mt-4">123, Main Street, Your City, 123456</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center py-4">
          <p className="text-center">
            &copy; 2025 <span className="font-semibold">CryptoByRA</span> All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
