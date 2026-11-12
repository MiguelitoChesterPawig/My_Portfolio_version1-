import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FlowTrack } from "@/components/FlowTrack";
import { About, Experience, Footer } from "@/components/Sections";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { AskAI } from "@/components/AskAI";
import { Contact } from "@/components/Contact";
import { CursorGlow, SmoothSnap } from "@/components/Effects";
import { BackToTop } from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <SmoothSnap />
      <Nav />
      <main className="relative">
        <Hero />
        <div className="dot-grid">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <FlowTrack>
              <About />
              <Skills />
              <Projects />
              <Experience />
              <AskAI />
              <Contact />
            </FlowTrack>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
