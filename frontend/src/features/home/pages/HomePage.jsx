import { Navbar } from '../../../components/layout/Navbar';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import FeaturedListings from '../components/FeaturedListings';
import TrustSafety from '../components/TrustSafety';
import FinalCTA from '../components/FinalCTA';
import Footer from '../../../components/layout/Footer';

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedListings />
        <TrustSafety />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}

export default HomePage;