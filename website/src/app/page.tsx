import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { Hero, Features, CTA } from "@/components/landing";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
