import HeroSection from "./components/HeroSection";
import Statistics from "./components/Statistics";
import GradeSelection from "./components/GradeSelection";
import FeaturesSection from "./components/FeaturesSection";
import "./Home.scss";
const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection></HeroSection>

      {/* Statistics */}
      <Statistics></Statistics>

      {/* Grade Selection */}
      <GradeSelection></GradeSelection>

      {/* Features Section */}
      <FeaturesSection></FeaturesSection>
    </>
  );
};

export default Home;
