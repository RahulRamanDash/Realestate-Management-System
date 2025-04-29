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