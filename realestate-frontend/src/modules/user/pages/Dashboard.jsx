import { useEffect, useState } from "react";
import { ChartColumn, CirclePlus, House, ShieldCheck, ArrowRight, Plus } from "lucide-react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import HeroSlider from "../../../components/HeroSlider";
import StatCard from "../../../components/StatCard";
import ActivityFeed from "../../../components/ActivityFeed";
import Button from "../../../components/Button/Button";
import { BUTTON_VARIANTS } from "../../../shared/utils/constants";
import { getLoggedUser, isAgent } from "../../../utils/auth";

const Dashboard = () => {
  const user = getLoggedUser();
  const agent = isAgent(user);
  const [propertyStats, setPropertyStats] = useState({
    primaryCount: 0,
    secondaryCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        return;
      }

      try {
        if (agent) {
          const response = await api.get("/properties", {
            params: { agentId: user.id },
          });
          const listings = Array.isArray(response.data) ? response.data : [];
          setPropertyStats({
            primaryCount: listings.length,
            secondaryCount: listings.filter((property) => property?.available === false || property?.buyerId).length,
          });
          return;
        }

        const response = await api.get(`/properties/buyer/${user.id}`);
        const ownedProperties = Array.isArray(response.data) ? response.data : [];
        setPropertyStats({
          primaryCount: ownedProperties.length,
          secondaryCount: ownedProperties.filter((property) => property?.type === "House").length,
        });
      } catch (statsError) {
        console.error("Failed to load dashboard stats:", statsError);
      }
    };

    fetchStats();
  }, [agent, user?.id]);

  return (
    <div className="page-shell">
      <DashboardNavbar />
      <HeroSlider
        headingText={`Welcome back${user?.name ? `, ${user.name}` : ""}. Manage your properties with less friction.`}
        button1Text={agent ? "My Listings" : "Owned Properties"}
        button1Link={agent ? "/my-listings" : "/owned-properties"}
        button2Text="Browse Properties"
        button2Link="/properties"
        eyebrowText={agent ? "Agent workspace" : "Buyer workspace"}
        supportingText="The dashboard is now structured like a real product surface, with clearer actions and better visual hierarchy for your next step."
        stats={
          agent
            ? [
                { value: propertyStats.primaryCount, label: "My listings" },
                { value: propertyStats.secondaryCount, label: "Sold" },
                { value: "Live", label: "Agent workflow" },
              ]
            : [
                { value: propertyStats.primaryCount, label: "Owned homes" },
                { value: propertyStats.secondaryCount, label: "Owned houses" },
                { value: "Ready", label: "Buyer workspace" },
              ]
        }
      />

      {/* Quick Stats Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-8"
          >
            <h2 className="headline-font page-heading text-2xl font-bold">Quick Stats</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {agent ? (
              <>
                <StatCard
                  icon={<House className="h-5 w-5" />}
                  label="Active Listings"
                  value={propertyStats.primaryCount}
                  animated={true}
                />
                <StatCard
                  icon={<ChartColumn className="h-5 w-5" />}
                  label="Sold Properties"
                  value={propertyStats.secondaryCount}
                  animated={true}
                />
                <StatCard
                  icon={<CirclePlus className="h-5 w-5" />}
                  label="Ready to Publish"
                  value="3"
                  animated={false}
                />
                <StatCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Status"
                  value="Active"
                  animated={false}
                />
              </>
            ) : (
              <>
                <StatCard
                  icon={<House className="h-5 w-5" />}
                  label="Owned Properties"
                  value={propertyStats.primaryCount}
                  animated={true}
                />
                <StatCard
                  icon={<ChartColumn className="h-5 w-5" />}
                  label="House Type"
                  value={propertyStats.secondaryCount}
                  animated={true}
                />
                <StatCard
                  icon={<CirclePlus className="h-5 w-5" />}
                  label="Wishlist Items"
                  value="5"
                  animated={false}
                />
                <StatCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Account Status"
                  value="Verified"
                  animated={false}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions & Activity */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-6 md:p-8"
          >
            <h3 className="headline-font page-heading mb-6 text-xl font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              {agent ? (
                <>
                  <Button
                    variant={BUTTON_VARIANTS.PRIMARY}
                    href="/add-property"
                    className="w-full justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Listing
                  </Button>
                  <Button
                    variant={BUTTON_VARIANTS.SECONDARY}
                    href="/my-listings"
                    className="w-full justify-center gap-2"
                  >
                    <House className="h-4 w-4" />
                    Manage Listings
                  </Button>
                  <Button
                    variant={BUTTON_VARIANTS.SECONDARY}
                    href="/properties"
                    className="w-full justify-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Browse Market
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={BUTTON_VARIANTS.PRIMARY}
                    href="/properties"
                    className="w-full justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Explore Properties
                  </Button>
                  <Button
                    variant={BUTTON_VARIANTS.SECONDARY}
                    href="/owned-properties"
                    className="w-full justify-center gap-2"
                  >
                    <House className="h-4 w-4" />
                    My Properties
                  </Button>
                  <Button
                    variant={BUTTON_VARIANTS.SECONDARY}
                    href="/add-property"
                    className="w-full justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    List a Property
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-6 md:p-8"
          >
            <h3 className="headline-font page-heading mb-6 text-xl font-semibold">Recent Activity</h3>
            <ActivityFeed
              activities={
                agent
                  ? [
                      {
                        type: 'listing',
                        title: 'New Listing Published',
                        description: 'Your modern villa listing went live',
                        time: '2 hours ago',
                      },
                      {
                        type: 'sold',
                        title: 'Property Sold',
                        description: 'Downtown apartment successfully sold',
                        time: '1 day ago',
                      },
                      {
                        type: 'purchase',
                        title: 'Inquiry Received',
                        description: '3 buyers interested in your property',
                        time: '3 days ago',
                      },
                    ]
                  : [
                      {
                        type: 'favorite',
                        title: 'Added to Favorites',
                        description: 'Beautiful villa in downtown area',
                        time: '2 hours ago',
                      },
                      {
                        type: 'purchase',
                        title: 'Property Viewed',
                        description: 'You viewed modern apartment listing',
                        time: '1 day ago',
                      },
                      {
                        type: 'listing',
                        title: 'New Listings in Your Area',
                        description: '5 new properties match your preferences',
                        time: '3 days ago',
                      },
                    ]
              }
            />
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-8"
          >
            <h2 className="headline-font page-heading text-2xl font-bold">How It Works</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <House className="h-5 w-5" />,
                title: agent ? "Manage inventory" : "Browse and buy",
                text:
                  agent
                    ? "Create, edit, and remove only the listings assigned to your own account."
                    : "Explore listings, review visible prices, and buy available properties directly from the marketplace.",
              },
              {
                icon: <ChartColumn className="h-5 w-5" />,
                title: agent ? "Track sold status" : "Track ownership",
                text: agent
                  ? "Sold properties stay visible in your workspace so agents can see what has closed."
                  : "Your dashboard can now route you straight to the properties you already own.",
              },
              {
                icon: <CirclePlus className="h-5 w-5" />,
                title: agent ? "Move faster" : "Shortlist faster",
                text: agent
                  ? "Primary actions are surfaced earlier so users do not need to hunt through the interface."
                  : "Available listings expose purchase actions directly from the same browse grid.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Build trust",
                text: "Consistent styling across auth, browse, and forms makes the product feel more reliable.",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                  {card.icon}
                </div>
                <h3 className="page-heading mt-5 text-lg font-semibold">{card.title}</h3>
                <p className="page-copy mt-3 text-sm leading-6">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
