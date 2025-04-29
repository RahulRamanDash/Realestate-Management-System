import HeroSlider from "../components/HeroSlider";

const Home = () => {
    return (
        <>
        <HeroSlider 
        headingText="Welcome Back, Manage Your Properties"
        button1Text="Browse Listings"
        button1Link="/properties"
        />
        </>
    );
}

export default Home