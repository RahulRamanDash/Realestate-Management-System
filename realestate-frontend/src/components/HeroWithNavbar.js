import React, { useEffect, useState } from "react";
import hero1 from "../util/images/hero_bg_1.jpg";
import hero2 from "../util/images/hero_bg_2.jpg";
import hero3 from "../util/images/hero_bg_3.jpg";

function HeroWithNavbar() {
  const images = [hero1, hero2, hero3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="font-sans bg-[#0f0f0f] text-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#1a1a1a] shadow-md sticky top-0 z-50 py-3">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-white">Property</a>

          <ul className="hidden lg:flex space-x-6 text-sm font-medium">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li className="group relative">
              <button className="hover:text-gray-300">Properties</button>
              <ul className="absolute hidden group-hover:block bg-[#2e2e2e] shadow-md mt-2 py-2 w-44 rounded z-20 text-sm">
                <li><a href="/buy" className="block px-4 py-2 hover:bg-[#3a3a3a]">Buy Property</a></li>
                <li><a href="/sell" className="block px-4 py-2 hover:bg-[#3a3a3a]">Sell Property</a></li>
                <li className="relative group">
                  <button className="block px-4 py-2 w-full text-left hover:bg-[#3a3a3a]">Dropdown</button>
                  <ul className="absolute hidden group-hover:block bg-[#3a3a3a] left-full top-0 ml-1 shadow-md py-2 w-44 rounded">
                    <li><a href="/submenu1" className="block px-4 py-2 hover:bg-[#444]">Sub Menu One</a></li>
                    <li><a href="/submenu2" className="block px-4 py-2 hover:bg-[#444]">Sub Menu Two</a></li>
                    <li><a href="/submenu3" className="block px-4 py-2 hover:bg-[#444]">Sub Menu Three</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="/services" className="hover:text-gray-300">Services</a></li>
            <li><a href="/about" className="hover:text-gray-300">About</a></li>
            <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
          </ul>

          <div className="hidden lg:flex space-x-3">
            <a href="/login" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm">Login</a>
            <a href="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm">Register</a>
          </div>

          <button className="lg:hidden text-white text-xl">☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Full image background, no opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />

        {/* Dark overlay, less intense */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-4xl font-semibold mb-6">
              Find your next perfect property
            </h1>
            <a
              href="/properties"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-md text-base transition duration-200"
            >
              Browse Listings
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HeroWithNavbar;