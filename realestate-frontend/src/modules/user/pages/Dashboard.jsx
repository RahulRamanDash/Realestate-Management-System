import { useEffect, useState } from "react";
import { ChartColumn, CirclePlus, House, ShieldCheck } from "lucide-react";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import HeroSlider from "../../../components/HeroSlider";
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

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
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
            <div key={card.title} className="glass-panel rounded-[1.8rem] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                {card.icon}
              </div>
              <h3 className="page-heading mt-5 text-xl font-semibold">{card.title}</h3>
              <p className="page-copy mt-3 text-sm leading-6">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
