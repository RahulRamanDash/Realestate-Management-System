import React, { useState } from "react";

function HomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="font-sans bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 flex items-center justify-between py-3">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold tracking-tight text-emerald-500">
          PropertyPro
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 text-sm font-medium">
          <li>
            <a href="/" className="hover:text-emerald-400 transition-colors duration-200">
              Home
            </a>
          </li>
          <li>
            <a href="/properties" className="hover:text-emerald-400 transition-colors duration-200">
              Properties
            </a>
          </li>
          <li>
            <a href="/services" className="hover:text-emerald-400 transition-colors duration-200">
              Services
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-emerald-400 transition-colors duration-200">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-emerald-400 transition-colors duration-200">
              Contact
            </a>
          </li>
        </ul>

        {/* Login/Register */}
        <div className="hidden lg:flex">
          <a
            href="/userAuth"
            className="hover:text-emerald-400 transition-colors duration-200 font-medium px-4 py-2"
          >
            Login / Register
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-2xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-800 px-6 py-4 space-y-3 text-white">
          <a href="/" className="block hover:text-emerald-400 transition">Home</a>
          <a href="/properties" className="block hover:text-emerald-400 transition">Properties</a>
          <a href="/services" className="block hover:text-emerald-400 transition">Services</a>
          <a href="/about" className="block hover:text-emerald-400 transition">About</a>
          <a href="/contact" className="block hover:text-emerald-400 transition">Contact</a>
          <a
            href="/userAuth"
            className="block px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded transition mt-2"
          >
            Login / Register
          </a>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;