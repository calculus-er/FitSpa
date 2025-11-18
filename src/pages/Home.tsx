import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTA } from '@/components/home/CTA';

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
};

export default Home;
