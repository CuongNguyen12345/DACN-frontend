
import HeroSection from "./components/HeroSection";
import JourneySection from "./components/JourneySection";
import BenefitsSection from "./components/BenefitsSection";
import FeaturedSubjects from "./components/FeaturedSubjects";

const Home = () => {
  return (
    <div className="home-dashboard pb-20 bg-white">
      <div className="container mx-auto px-4 space-y-8">
        {/* Banner Section */}
        <section>
          <HeroSection />
        </section>

        {/* Journey Section */}
        <section>
          <JourneySection />
        </section>

        {/* Benefits Section */}
        <section>
          <BenefitsSection />
        </section>

        {/* Featured Subjects */}
        <section>
          <FeaturedSubjects />
        </section>
      </div>
    </div>
  );
};

export default Home;
