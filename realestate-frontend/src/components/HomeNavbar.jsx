import React from "react";

function HomeNavbar(){
  return (
    <div className="font-sans bg-[#0f0f0f] text-white">
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
      </div>
);
}

export default HomeNavbar;