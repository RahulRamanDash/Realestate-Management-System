import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FaHandshake, FaHome, FaSearch } from "react-icons/fa";
import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import HomeNavbar from "../components/HomeNavbar";
import { Button } from "../components/index";
import StatCard from "../components/StatCard";
import CTASection from "../components/CTASection";
import FAQ from "../components/FAQ";

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

  const faqItems = [
    {
      question: "How do I list a property?",
      answer: "Sign up as an agent, navigate to 'Add Property', fill in the details, upload images, and publish. Your listing will be visible to all buyers immediately.",
    },
    {
      question: "Is it safe to buy properties on this platform?",
      answer: "Yes, we verify all agents and listings. All transactions are transparent and secure with built-in trust signals and verified agent information.",
    },
    {
      question: "What are the fees for agents?",
      answer: "We offer flexible pricing plans for agents. Check our pricing page or contact our sales team for detailed information on commission structures.",
    },
    {
      question: "Can I edit my listing after publishing?",
      answer: "Absolutely! You can edit, update images, change pricing, or unpublish your listing anytime from your dashboard.",
    },
    {
      question: "How do I track property inquiries?",
      answer: "All inquiries appear in your dashboard in real-time. You'll get notifications for interested buyers and can respond directly through the platform.",
    },
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
            <h1 className="headline-font page-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              A sharper way to buy, list, and manage property.
            </h1>
            <p className="page-copy max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed">
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

      {/* Features Section */}
      <section className="section-shell px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-center">
            <span className="eyebrow mb-4">Platform Focus</span>
            <h2 className="headline-font page-heading text-3xl md:text-4xl font-bold mb-4">
              Built to feel premium without getting in the way.
            </h2>
            <p className="page-copy text-base leading-7 mb-8">
              The interface now leans into stronger typography, layered surfaces, and clearer calls to action so users can scan listings and complete tasks faster.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                value={500}
                suffix="+"
                label="Properties listed"
                animated={true}
              />
              <StatCard
                value={100}
                suffix="+"
                label="Active agents"
                animated={true}
              />
              <StatCard
                value={1000}
                suffix="+"
                label="Happy clients"
                animated={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <div className="flex flex-col items-start">
                  <div className="info-card rounded-xl p-3 bg-emerald-400/10">{feature.icon}</div>
                  <h3 className="page-heading mt-5 text-lg md:text-xl font-semibold">{feature.title}</h3>
                  <p className="page-copy mt-3 text-sm leading-6">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="px-4 pb-16 md:pb-20">
        <div className="glass-panel-strong mx-auto max-w-7xl rounded-2xl p-6 md:p-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="headline-font page-heading text-3xl md:text-4xl font-bold"
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
              <div key={item.title} className="info-card p-6 rounded-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                  {item.icon}
                </div>
                <h3 className="page-heading mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="page-copy mt-3 text-sm leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* CTA + Stats Section */}
      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid gap-6 md:grid-cols-3">
            <StatCard
              icon={<Building2 className="h-5 w-5" />}
              value={500}
              suffix="+"
              label="Properties listed"
              animated={true}
            />
            <StatCard
              icon={<ShieldCheck className="h-5 w-5" />}
              value={100}
              suffix="+"
              label="Active agents"
              animated={true}
            />
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
              value={1000}
              suffix="+"
              label="Happy clients"
              animated={true}
            />
          </div>

          <CTASection
            headline="Ready to find your dream property?"
            description="Join thousands of buyers and agents using our platform to discover, list, and manage properties with confidence."
            primaryButtonText="Start Browsing"
            primaryButtonLink="/properties"
            secondaryButtonText="Create Account"
            secondaryButtonLink="/userAuth?tab=register"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="headline-font page-heading mb-4 text-3xl font-bold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="page-copy text-emerald-100/70">
              Find answers to common questions about listing, buying, and managing properties on our platform.
            </p>
          </motion.div>

          <FAQ items={faqItems} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <CTASection
            headline="Get started today"
            description="Whether you're buying your first home or listing multiple properties, we've made it simple and transparent."
            primaryButtonText="Browse Properties"
            primaryButtonLink="/properties"
            secondaryButtonText="List with Us"
            secondaryButtonLink="/userAuth?tab=register"
            dark={true}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
