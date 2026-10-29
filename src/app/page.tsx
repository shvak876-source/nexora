import { Header, Hero, Marquee, Stats } from "@/components/site/hero";
import { Faq, ProblemPicker, Process, Promise, Services } from "@/components/site/sections";
import { Contact, Footer, MobileBar } from "@/components/site/contact";

export default function Home() {
  return (
    <>
      <a
        href="#services"
        className="absolute start-4 -top-16 z-[100] rounded-xl bg-primary px-4 py-3 font-bold text-on-primary transition-[top] focus:top-3"
      >
        דלגו לתוכן
      </a>
      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <ProblemPicker />
        <Process />
        <Promise />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
