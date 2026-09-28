import Navbar from "~/components/Navbar";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Pricing } from "./components/Pricing";
import { Testimonial } from "./components/Testimonial";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />

      <Features />

      <section id="pricing">
        <Pricing />
      </section>

      <Testimonial />

      <Footer />
    </>
  );
}
