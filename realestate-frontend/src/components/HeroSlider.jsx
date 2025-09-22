import React, { useEffect, useState } from "react";
import hero1 from "/images/hero_bg_1.jpg";
import hero2 from "/images/hero_bg_2.jpg";
import hero3 from "/images/hero_bg_3.jpg";
import { useNavigate } from "react-router-dom";

function HeroSlider({
  headingText = "Find your next perfect property",
  button1Text = "Browse Listings",
  button1Link = "/properties",
  button2Text,           // optional
  button2Link,           // optional
}) {
  const images = [hero1, hero2, hero3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen">

      {/* Hero Section */}
      <div className="relative w-full" style={{ height: "calc(100vh - 65px)" }}>
        {/* Full image background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-semibold mb-6 max-w-3xl">
            {headingText}
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* First Button */}
            <button
              onClick={() => navigate(button1Link)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-200"
            >
              {button1Text}
            </button>

            {/* Conditionally Render Second Button */}
            {button2Text && button2Link && (
              <button
                onClick={() => navigate(button2Link)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-200"
              >
                {button2Text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSlider;