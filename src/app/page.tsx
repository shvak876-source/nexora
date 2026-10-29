import { Header, Hero, Marquee, Stats } from "@/components/site/hero";
import { Faq, ProblemPicker, Process, Promise, Services } from "@/components/site/sections";
import { Contact, Footer, MobileBar } from "@/components/site/contact";
import { ScrollHighlight, ScrollProgress } from "@/components/site/motion";
import { Connections } from "@/components/site/beams";

export default function Home() {
  return (
    <>
      <a
        href="#services"
        className="absolute start-4 -top-16 z-[100] rounded-xl bg-primary px-4 py-3 font-bold text-on-primary transition-[top] focus:top-3"
      >
        דלגו לתוכן
      </a>
      <ScrollProgress />
      <Header />
      <main id="top">
        <Hero />
        <Marquee />
        <Stats />
        <ScrollHighlight text="לא מוכרים לכם טכנולוגיה. בונים לכם כלי עבודה שחוסך זמן ומכניס כסף." glowFrom={8} />
        <Services />
        <Connections />
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
