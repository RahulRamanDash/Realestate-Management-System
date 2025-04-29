import HeroSlider from "../../../components/HeroSlider";
import HomeNavbar from "../../../components/HomeNavbar";

const AgentDashboard = () => {
    return (
        <>
        <HomeNavbar/>
        <HeroSlider 
        headingText="Find your dream property"
        button1Text="Agent"
        button1Link="/agentAuth"
        button2Text="Buyer"
        button2Link="/buyerAuth"
        />
        </>
    );
}

export default AgentDashboard