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
    <div className="font-sans bg-[#46344E] text-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#46344E] shadow-md sticky top-0 z-50 py-5">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-3xl font-bold text-[#FAED26]">Property</a>

          <ul className="hidden lg:flex space-x-8 text-lg font-medium">
            <li><a href="/" className="hover:text-[#FAED26]">Home</a></li>
            <li className="group relative">
              <button className="hover:text-[#FAED26]">Properties</button>
              <ul className="absolute hidden group-hover:block bg-[#5A5560] shadow-md mt-2 py-2 w-44 rounded z-20">
                <li><a href="/buy" className="block px-4 py-2 hover:bg-[#9D8D8F]">Buy Property</a></li>
                <li><a href="/sell" className="block px-4 py-2 hover:bg-[#9D8D8F]">Sell Property</a></li>
                <li className="relative group">
                  <button className="block px-4 py-2 w-full text-left hover:bg-[#9D8D8F]">Dropdown</button>
                  <ul className="absolute hidden group-hover:block bg-[#9D8D8F] left-full top-0 ml-1 shadow-md py-2 w-44 rounded">
                    <li><a href="/submenu1" className="block px-4 py-2 hover:bg-[#9B786F]">Sub Menu One</a></li>
                    <li><a href="/submenu2" className="block px-4 py-2 hover:bg-[#9B786F]">Sub Menu Two</a></li>
                    <li><a href="/submenu3" className="block px-4 py-2 hover:bg-[#9B786F]">Sub Menu Three</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="/services" className="hover:text-[#FAED26]">Services</a></li>
            <li><a href="/about" className="hover:text-[#FAED26]">About</a></li>
            <li><a href="/contact" className="hover:text-[#FAED26]">Contact Us</a></li>
          </ul>

          <div className="hidden lg:flex space-x-4">
            <a href="/login" className="bg-[#FAED26] text-black px-5 py-2 rounded-md text-base hover:bg-[#e9da20]">Login</a>
            <a href="/register" className="bg-[#FAED26] text-black px-5 py-2 rounded-md text-base hover:bg-[#e9da20]">Register</a>
          </div>

          <button className="lg:hidden text-white text-3xl">☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-[#FAED26]">
              Easiest way to find your dream home
            </h1>
            <form className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Your ZIP code or City. e.g. New York"
                className="w-full px-6 py-4 rounded-md text-gray-900 text-lg"
              />
              <button className="bg-[#FAED26] text-black px-6 py-4 rounded-md text-lg hover:bg-[#e9da20]">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroWithNavbar;