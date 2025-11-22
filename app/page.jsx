"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { FeaturedProjects } from "@/components/landing/featured-projects";
import { Workflow } from "@/components/landing/workflow";
import { ContactForm } from "@/components/landing/contact-form";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <WhyChooseUs />
      <FeaturedProjects />
      <Workflow />
      <ContactForm />
      <Footer />
    </main>
  );
}
