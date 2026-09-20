import type { Route } from "./+types/home";
import { Categories } from "../components/landing/Categories";
import { Faq } from "../components/landing/Faq";
import { FeaturedCourses } from "../components/landing/FeaturedCourses";
import { Footer } from "../components/landing/Footer";
import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { Pricing } from "../components/landing/Pricing";
import { Testimonials } from "../components/landing/Testimonials";
import { TopInstructors } from "../components/landing/TopInstructors";
import { TrustedBy } from "../components/landing/TrustedBy";
import { WhyChooseUs } from "../components/landing/WhyChooseUs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Learnova — Learn Smarter. Achieve Greater." },
    {
      name: "description",
      content:
        "Discover premium courses taught by industry experts. Learn at your own pace and build skills that matter.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <FeaturedCourses />
        <Categories />
        <WhyChooseUs />
        <TopInstructors />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}