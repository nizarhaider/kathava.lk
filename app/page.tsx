import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import InteractiveDemo from '@/components/InteractiveDemo';
import Features from '@/components/Features';
import Steps from '@/components/Steps';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="-mt-16 relative z-10 px-6">
        <InteractiveDemo />
      </div>
      <Features />
      <Steps />
      <Benefits />
      <Footer />
    </main>
  );
}
