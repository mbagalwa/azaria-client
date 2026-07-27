import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SpecialOrder } from "@/components/special-order";
import { WeekProgram } from "@/components/week-program";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Hero />
        <About />
        <WeekProgram />
        <HowItWorks />
        <SpecialOrder />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
