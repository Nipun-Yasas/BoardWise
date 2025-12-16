import { Features } from "./_components/landing/Features";
import { Navigation } from "./_components/Navigation";
import { BackgroundLines } from "./_components/landing/BackgroundLines";
import { Stat } from "./_components/landing/Stat";
import { Testimonial } from "./_components/Testimonial";
import { HowItWorks } from "./_components/landing/HowItWorks";
import { Footer } from "./_components/landing/Footer";

export default function Home() {
  return (
    <div className="">
      <Navigation />
      <BackgroundLines className="flex items-center justify-center flex-col pt-24 sm:pt-24 md:pt-12 lg:pt-28 px-4 sm:px-6 md:px-12 lg:px-12 w-full max-w-7xl mx-auto">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl sm:text-5xl lg:text-7xl mb-4 py-4 sm:py-4 md:py-10 relative z-20 font-bold tracking-tight">
          Find Your Dream <br /> Boarding Place
        </h2>
        <p className="text-sm md:text-lg text-textPrimary text-center mb-8">
          Discover the perfect home away from home. Browse verified boarding
          places near your university with ease.
        </p>
        <Stat />
      </BackgroundLines>
      <Features />
      <Testimonial />
      <HowItWorks />
      <Footer />
    </div>
  );
}
