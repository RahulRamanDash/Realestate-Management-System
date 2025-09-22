import DashboardNavbar from "../../../components/DashboardNavbar";
import HeroSlider from "../../../components/HeroSlider";

const Dashboard = () => {
    return (
        <>
         <div className="bg-[#0f0f0f] text-white">
            <DashboardNavbar role="agent" />
            {/* buyer content */}
        <HeroSlider
        headingText="Welcome Back, Manage Your Properties"
        button1Text="Browse Listings"
        button1Link="/properties"
        />
        </div>
        </>
    );
}

export default Dashboard