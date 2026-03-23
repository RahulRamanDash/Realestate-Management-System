import React, { useEffect, useState } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hero1 from "/images/hero_bg_1.jpg";
import hero2 from "/images/hero_bg_2.jpg";
import hero3 from "/images/hero_bg_3.jpg";

function HeroSlider({
  headingText = "Find your next perfect property",
  button1Text = "Browse Properties",
  button1Link = "/properties",
  button2Text,
  button2Link,
  eyebrowText = "Premier property platform",
  supportingText = "Browse verified homes, compare neighborhoods, and move from discovery to deal management in one place.",
  stats = [
    { value: "500+", label: "Active listings" },
    { value: "45+", label: "Partner agents" },
    { value: "98%", label: "Client satisfaction" },
  ],
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
    <section className="relative overflow-hidden">
      <div className="relative w-full" style={{ minHeight: "calc(100vh - 81px)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="hero-accent absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid w-full items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-3xl">
              <span className="eyebrow mb-6">{eyebrowText}</span>
              <div className="headline-font page-heading mb-6 text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-7xl">
                {headingText}
              </div>
              <p className="page-copy max-w-2xl text-base leading-7 sm:text-lg">
                {supportingText}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => navigate(button1Link)} className="primary-button">
                  {button1Text}
                  <ArrowRight className="h-4 w-4" />
                </button>
                {button2Text && button2Link && (
                  <button onClick={() => navigate(button2Link)} className="secondary-button">
                    <PlayCircle className="h-4 w-4" />
                    {button2Text}
                  </button>
                )}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <p className="headline-font page-heading text-3xl font-bold">{stat.value}</p>
                    <p className="page-copy mt-2 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel hidden rounded-[2rem] p-6 lg:block">
              <div className="hero-side-panel rounded-[1.6rem] border soft-border p-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200/80">
                  Featured districts
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    { name: "Downtown Core", detail: "Luxury apartments and walkable retail" },
                    { name: "Greenview", detail: "Family homes with parks and schools" },
                    { name: "Riverside", detail: "Waterfront villas and premium amenities" },
                  ].map((item) => (
                    <div key={item.name} className="info-card rounded-3xl p-4">
                      <p className="headline-font page-heading text-xl font-bold">{item.name}</p>
                      <p className="page-copy mt-2 text-sm leading-6">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? "w-10 bg-emerald-300" : "w-2.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
