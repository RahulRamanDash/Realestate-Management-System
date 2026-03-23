import { motion } from "framer-motion";
import { FaHandshake, FaHome, FaSearch } from "react-icons/fa";
import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import HomeNavbar from "../components/HomeNavbar";

const Home = () => {
  const features = [
    {
      icon: <FaHome className="text-4xl text-emerald-500" />,
      title: "Wide Range of Properties",
      description: "Explore apartments, villas, and houses organized in a cleaner marketplace layout.",
    },
    {
      icon: <FaSearch className="text-4xl text-emerald-500" />,
      title: "Smart Search",
      description: "Filter by city, type, and price ranges without losing context or visual clarity.",
    },
    {
      icon: <FaHandshake className="text-4xl text-emerald-500" />,
      title: "Expert Agents",
      description: "Give buyers a stronger sense of confidence with a more polished and trustworthy interface.",
    },
  ];

  const spotlightStats = [
    { value: "12", label: "Cities covered" },
    { value: "24/7", label: "Lead tracking" },
    { value: "One", label: "Unified property workflow" },
  ];

  return (
    <div className="page-shell">
      <HomeNavbar />

      <HeroSlider
        headingText={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <h1 className="headline-font page-heading text-5xl font-bold md:text-6xl lg:text-7xl">
              A sharper way to buy, list, and manage property.
            </h1>
            <p className="page-copy max-w-2xl text-lg md:text-xl">
              Discover curated listings, move faster with agent tools, and give buyers a cleaner path from search to shortlist.
            </p>
          </motion.div>
        }
        button1Text="Start Browsing"
        button1Link="/properties"
        button2Text="Create Account"
        button2Link="/userAuth?tab=register"
        eyebrowText="Modern real-estate workspace"
        supportingText="Designed for buyers who want clarity and agents who need a simpler place to publish listings, track demand, and keep momentum."
      />

      <section className="section-shell px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel rounded-[2rem] p-8">
            <span className="eyebrow">Platform Focus</span>
            <h2 className="headline-font page-heading mt-6 text-3xl font-bold md:text-4xl">
              Built to feel premium without getting in the way.
            </h2>
            <p className="page-copy mt-4 text-base leading-7">
              The interface now leans into stronger typography, layered surfaces, and clearer calls to action so users can scan listings and complete tasks faster.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {spotlightStats.map((item) => (
                <div key={item.label} className="info-card rounded-3xl p-4">
                  <p className="headline-font page-heading text-3xl font-bold">{item.value}</p>
                  <p className="page-copy mt-2 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="why-us" className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-panel rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-start">
                  <div className="info-card rounded-2xl p-4">{feature.icon}</div>
                  <h3 className="page-heading mt-5 text-xl font-semibold">{feature.title}</h3>
                  <p className="page-copy mt-3 text-sm leading-6">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="glass-panel-strong mx-auto max-w-7xl rounded-[2rem] p-8 md:p-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="headline-font page-heading text-3xl font-bold md:text-4xl"
          >
            Everything important, surfaced earlier
          </motion.h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: <Building2 className="h-5 w-5" />,
                title: "Listing-first experience",
                description: "Property cards now feel like real inventory, with pricing, location, and high-signal metadata grouped more clearly.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Clearer trust signals",
                description: "Dashboard, auth, and browsing flows use consistent surfaces and hierarchy so the product feels more credible.",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Stronger visual identity",
                description: "A greener editorial look, layered backgrounds, and better type make the app feel more intentional and less template-like.",
              },
            ].map((item) => (
              <div key={item.title} className="info-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                  {item.icon}
                </div>
                <h3 className="page-heading mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="page-copy mt-3 text-sm leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto]">
          <div className="glass-panel rounded-[2rem] p-8">
            <p className="eyebrow">Scale Snapshot</p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { value: "500+", label: "Properties listed" },
                { value: "100+", label: "Active agents" },
                { value: "1,000+", label: "Happy clients" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="summary-card rounded-[1.6rem] p-6 text-center"
                >
                  <h3 className="headline-font page-heading mb-2 text-4xl font-bold">{stat.value}</h3>
                  <p className="soft-text">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <a href="/properties" className="primary-button self-center whitespace-nowrap">
            Browse properties
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
