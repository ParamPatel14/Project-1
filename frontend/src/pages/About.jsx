import React from "react";
import { Link } from "react-router-dom";
import founderPhoto from "../../founder_photo.jpeg";
import coFounderPhoto from "../../co-founder.jpeg";

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] font-sans">
      <header className="border-b border-stone-200 bg-[var(--color-academia-cream)]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-academia-charcoal)] rounded-sm flex items-center justify-center text-[var(--color-academia-cream)] font-serif font-bold text-xl shadow-lg">
              R
            </div>
            <span className="text-xl font-bold tracking-tight font-serif">
              Shaun Spherix Solutions LLP
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className="text-stone-600 hover:text-[var(--color-academia-gold)] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 border border-[var(--color-academia-charcoal)] rounded-sm text-[var(--color-academia-charcoal)] hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        <section className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            Building precise academic pathways between students, mentors, and research labs.
          </h1>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-3xl border-l-4 border-[var(--color-academia-gold)] pl-5">
            Shaun Spherix Solutions LLP designs research-first platforms where methodology
            gaps, supervisor alignment, and opportunity discovery live in one Deep Academia
            ecosystem. Every feature is calibrated to close the distance between serious
            learners and the mentors, labs, and funding that can transform their work.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8 flex gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-200 shadow-md flex-shrink-0">
              <img
                src={founderPhoto}
                alt="Founder: Dr. Sonia Maria D'Souza"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
                Founder
              </p>
              <p className="text-xl md:text-2xl font-serif font-bold">
                Dr. Sonia Maria D&apos;Souza
              </p>
              <p className="text-sm text-stone-600">
                Founder &amp; Director, Shaun Spherix Solutions LLP
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Dr. Sonia leads the academic vision behind Shaun Spherix, ensuring that
                every workflow respects scholarly rigor while staying approachable for
                students taking their first serious step into research.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-sm shadow-sm p-8 flex gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-200 shadow-md flex-shrink-0">
              <img
                src={coFounderPhoto}
                alt="Co-Founder: Mr. Pradeep Kumar V"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
                Co-Founder
              </p>
              <p className="text-xl md:text-2xl font-serif font-bold">
                Mr. Pradeep Kumar V
              </p>
              <p className="text-sm text-stone-600">
                Co-Founder, Shaun Spherix Solutions LLP
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Pradeep steers operations and partnerships, connecting universities and
                industry mentors so that each collaboration on the platform is grounded in
                real-world outcomes.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 pt-4">
          <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)] mb-2">
              Company
            </p>
            <p className="text-sm text-stone-700">
              Shaun Spherix Solutions LLP is incorporated as a research technology studio
              dedicated to long-horizon academic work rather than short-term content.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)] mb-2">
              Formation
            </p>
            <p className="text-sm text-stone-700 space-y-1">
              <span className="block">Formed on: 10/02/2026</span>
              <span className="block">DIN: 11541916</span>
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)] mb-2">
              Ethos
            </p>
            <p className="text-sm text-stone-700">
              The ethos of the studio is Deep Academia: carefully designed flows, clear
              expectations between mentors and students, and tooling that respects focus.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

