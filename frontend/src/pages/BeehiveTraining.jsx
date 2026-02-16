import React from 'react';
import beekeepingHero from '../../beekeeping.jpg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHexagon, FiUsers, FiMapPin, FiClock } from 'react-icons/fi';

const EmpathySvg = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-20 h-20 text-black"
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="32" fill="currentColor" />
    <path
      d="M26 46 L40 30 L64 28 L78 40 L76 60 L60 72 L40 70 Z"
      fill="#F7F5F0"
    />
    <rect x="78" y="60" width="20" height="30" rx="2" fill="currentColor" />
    <circle cx="88" cy="56" r="6" fill="currentColor" />
    <rect x="84" y="70" width="8" height="18" fill="#F7F5F0" />
  </svg>
);

const FoodSvg = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-20 h-20 text-black"
    aria-hidden="true"
  >
    <rect x="18" y="60" width="80" height="10" fill="currentColor" />
    <rect x="18" y="74" width="80" height="6" fill="currentColor" />
    <rect x="18" y="86" width="50" height="4" fill="currentColor" />
    <rect x="56" y="40" width="42" height="24" fill="currentColor" />
    <circle cx="42" cy="70" r="14" fill="currentColor" />
    <polygon points="20,50 40,34 46,40 28,54" fill="currentColor" />
    <rect x="68" y="30" width="4" height="12" fill="currentColor" />
    <path d="M70 26 Q76 20 82 24" stroke="currentColor" strokeWidth="3" fill="none" />
  </svg>
);

const ChoicesSvg = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-20 h-20 text-black"
    aria-hidden="true"
  >
    <polygon points="46,24 70,26 60,40 46,38" fill="currentColor" />
    <rect x="52" y="40" width="16" height="18" fill="currentColor" />
    <circle cx="60" cy="36" r="6" fill="currentColor" />
    <rect x="46" y="58" width="28" height="26" fill="currentColor" />
    <rect x="40" y="84" width="14" height="20" fill="currentColor" />
    <rect x="66" y="84" width="14" height="20" fill="currentColor" />
    <circle cx="82" cy="26" r="4" fill="currentColor" />
    <path d="M82 18 L82 14" stroke="currentColor" strokeWidth="2" />
    <path d="M76 20 L72 18" stroke="currentColor" strokeWidth="2" />
    <path d="M88 20 L92 18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const FarmingSvg = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-20 h-20 text-black"
    aria-hidden="true"
  >
    <rect x="20" y="70" width="12" height="34" fill="currentColor" />
    <circle cx="26" cy="60" r="8" fill="currentColor" />
    <rect x="16" y="82" width="4" height="28" fill="currentColor" />
    <rect x="30" y="82" width="4" height="28" fill="currentColor" />
    <rect x="50" y="64" width="4" height="50" fill="currentColor" />
    <rect x="64" y="54" width="8" height="36" fill="currentColor" />
    <rect x="78" y="50" width="10" height="40" fill="currentColor" />
    <rect x="92" y="60" width="6" height="32" fill="currentColor" />
    <rect x="46" y="92" width="60" height="4" fill="currentColor" />
  </svg>
);

const BeeBiologySvg = () => (
  <svg viewBox="0 0 120 120" className="w-8 h-8 text-black" aria-hidden="true">
    <circle cx="40" cy="40" r="14" fill="currentColor" />
    <rect x="30" y="52" width="20" height="18" rx="9" fill="currentColor" />
    <path d="M32 44 L24 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M48 44 L56 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <rect x="36" y="30" width="8" height="4" fill="#F7F5F0" />
    <circle cx="76" cy="38" r="10" fill="currentColor" />
    <rect x="70" y="46" width="12" height="18" rx="6" fill="currentColor" />
  </svg>
);

const PollinationSvg = () => (
  <svg viewBox="0 0 120 120" className="w-8 h-8 text-black" aria-hidden="true">
    <circle cx="40" cy="40" r="8" fill="currentColor" />
    <circle cx="30" cy="30" r="6" fill="currentColor" />
    <circle cx="50" cy="30" r="6" fill="currentColor" />
    <circle cx="30" cy="50" r="6" fill="currentColor" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <rect x="70" y="30" width="30" height="6" fill="currentColor" />
    <rect x="70" y="42" width="22" height="6" fill="currentColor" />
    <rect x="70" y="54" width="16" height="6" fill="currentColor" />
  </svg>
);

const EthicalSvg = () => (
  <svg viewBox="0 0 120 120" className="w-8 h-8 text-black" aria-hidden="true">
    <rect x="36" y="26" width="8" height="40" fill="currentColor" />
    <rect x="76" y="26" width="8" height="40" fill="currentColor" />
    <rect x="36" y="40" width="48" height="6" fill="currentColor" />
    <circle cx="40" cy="70" r="8" fill="currentColor" />
    <circle cx="80" cy="70" r="8" fill="currentColor" />
  </svg>
);

const LiveHiveSvg = () => (
  <svg viewBox="0 0 120 120" className="w-8 h-8 text-black" aria-hidden="true">
    <rect x="32" y="30" width="56" height="12" rx="4" fill="currentColor" />
    <rect x="32" y="46" width="56" height="12" rx="4" fill="currentColor" />
    <rect x="32" y="62" width="56" height="12" rx="4" fill="currentColor" />
    <rect x="40" y="74" width="12" height="20" fill="currentColor" />
    <rect x="68" y="74" width="12" height="20" fill="currentColor" />
  </svg>
);

const HoneySvg = () => (
  <svg viewBox="0 0 120 120" className="w-8 h-8 text-black" aria-hidden="true">
    <rect x="38" y="30" width="32" height="10" fill="currentColor" />
    <rect x="36" y="40" width="36" height="40" rx="6" fill="currentColor" />
    <rect x="44" y="36" width="20" height="4" fill="#F7F5F0" />
    <rect x="50" y="54" width="8" height="16" fill="#F7F5F0" />
  </svg>
);

const BeehiveTraining = () => {
  const modules = [
    {
      title: "Bee Biology & Behaviour",
      description: "How bees live, communicate, and function together as a colony.",
      icon: BeeBiologySvg
    },
    {
      title: "Pollination & Ecosystems",
      description: "The role of bees in farms, forests, and food systems.",
      icon: PollinationSvg
    },
    {
      title: "Ethical Beekeeping Practices",
      description: "Bee-first methods, seasonal care, and low-stress management.",
      icon: EthicalSvg
    },
    {
      title: "Live Hive Demonstration",
      description: "Hands-on learning with real hives, frames, tools, and techniques.",
      icon: LiveHiveSvg
    },
    {
      title: "Hive Products & Honey Basics",
      description: "Understanding honey, wax, pollen, propolis, and quality essentials.",
      icon: HoneySvg
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] font-sans">
      <nav className="w-full border-b border-stone-200 bg-[var(--color-academia-cream)]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-sm bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] flex items-center justify-center shadow-md">
              <FiHexagon className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs tracking-[0.2em] uppercase text-stone-500">Real World Track</span>
              <span className="text-sm font-semibold font-serif">Beehive Mentorship Weekends</span>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-medium px-4 py-2 rounded-sm border border-stone-300 hover:border-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-charcoal)] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <section className="w-full bg-[var(--color-academia-cream)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <img
              src={beekeepingHero}
              alt="Beekeeping training with hive inspection"
              className="w-full h-[260px] md:h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/5" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 py-8 md:px-12 md:py-10 max-w-xl md:max-w-2xl text-[var(--color-academia-cream)] space-y-4">
                <p className="text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-[var(--color-academia-gold)]">
                  Beehive Training
                </p>
                <h1 className="text-2xl md:text-4xl font-serif font-bold leading-tight">
                  Beehive mentorship weekends that blend fieldwork with deep observation.
                </h1>
                <p className="text-xs md:text-sm text-stone-200 max-w-md">
                  Learn beekeeping, understand nature, and build empathy for pollinators through live
                  hive sessions and guided reflection.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    to="/dashboard?beehive=1"
                    className="px-5 py-2.5 rounded-sm bg-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] text-xs md:text-sm font-semibold hover:bg-[var(--color-academia-gold-hover)] transition-colors shadow-md"
                  >
                    Book a session
                  </Link>
                  <span className="text-[10px] md:text-xs text-stone-300">
                    Opens your Beehive mentorship events inside ResearchMatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-8 py-16 space-y-16">
        <section className="space-y-10">
          <div className="grid gap-10 md:grid-cols-[0.85fr,1.15fr] items-start">
            <div className="space-y-5">
              <p className="text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-academia-gold)]">
                More than a weekend
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold leading-[1.04] tracking-tight">
                <span className="block">MORE THAN A</span>
                <span className="block">SKILL.</span>
                <span className="block">A PERSPECTIVE.</span>
              </h2>
            </div>

            <div className="space-y-4 md:pt-3">
              <p className="text-sm md:text-base text-stone-700 leading-relaxed max-w-xl">
                Beehive Mentorship Weekends offer a hands-on introduction to bees, pollination, and
                sustainable agriculture. While practical beekeeping skills are central, the track
                also helps participants understand how bees support ecosystems, livelihoods, and
                food security.
              </p>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-[0.9fr,1.1fr] items-start">
            <div className="rounded-[2.75rem] bg-[#F5DA92] p-6 md:p-9 md:max-w-md shadow-sm">
              <p className="text-[11px] md:text-xs font-semibold tracking-[0.26em] uppercase text-[var(--color-academia-charcoal)] mb-3">
                What you&apos;ll learn
              </p>
              <p className="text-sm md:text-base text-stone-900 leading-relaxed">
                This training builds knowledge, curiosity, and empathy for the world bees sustain –
                and gives you a structured lens to analyse real-world systems as a researcher.
              </p>
            </div>

            <div className="space-y-4 md:pt-3">
              {modules.map((module) => {
                return (
                  <div
                    key={module.title}
                    className="flex flex-col md:flex-row items-stretch bg-white border border-stone-200 rounded-full shadow-md overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-5 py-3 md:px-7 md:py-4 md:w-96">
                      <div className="w-9 h-9 rounded-full bg-black flex-shrink-0" />
                      <p className="text-sm md:text-base font-semibold text-[var(--color-academia-charcoal)]">
                        {module.title}
                      </p>
                    </div>
                    <div className="border-t md:border-t-0 md:border-l border-stone-200 px-6 py-3 md:py-4 text-sm md:text-base text-stone-700">
                      {module.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-10 md:grid-cols-[1.15fr,0.85fr] items-start">
          <div className="space-y-4">
            <div className="p-4 rounded-sm bg-white border border-stone-100 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 mb-1">
                Format
              </p>
              <p className="text-sm text-stone-800">
                Small-group, interactive sessions that mix classroom-style reflection with live hive
                demonstrations.
              </p>
            </div>
            <div className="p-4 rounded-sm bg-white border border-stone-100 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 mb-1">
                Who joins
              </p>
              <p className="text-sm text-stone-800">
                Aspiring beekeepers, students, researchers, and nature lovers exploring sustainability.
              </p>
            </div>
            <div className="p-4 rounded-sm bg-white border border-stone-100 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 mb-1">
                Outcomes
              </p>
              <p className="text-sm text-stone-800">
                Empathy for pollinators, systems thinking, and applied sustainability you can bring
                back into your projects and research.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-sm bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] p-6 shadow-lg">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)] mb-3">
                Location
              </p>
              <div className="flex items-start gap-3 text-sm">
                <FiMapPin className="mt-1 w-4 h-4 text-[var(--color-academia-gold)]" />
                <p className="leading-relaxed">
                  63/2, Nelamangala Magadi road, Kadabagere, Byandahalli, Bengaluru, Karnataka 562130
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-stone-300">
                <FiClock className="w-4 h-4" />
                <span>Mon – Sat · 9:30 am – 6:00 pm (as per partner schedule)</span>
              </div>
            </div>

            <div className="rounded-sm bg-[var(--color-academia-gold)]/8 border border-[var(--color-academia-gold)]/40 p-5">
              <div className="flex items-start gap-3">
                <FiUsers className="w-5 h-5 text-[var(--color-academia-gold)] mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)]">
                    Beehive Mentorship in ResearchMatch
                  </p>
                  <p className="text-sm text-stone-800">
                    Completing this experience can be reflected as a Beehive Mentorship Weekend on your
                    ResearchMatch profile, signalling hands-on exposure to sustainability and systems thinking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.26em] uppercase text-[var(--color-academia-gold)]">
              Who can attend?
            </p>
            <h3 className="mt-2 text-2xl md:text-3xl font-serif font-bold tracking-tight text-[var(--color-academia-charcoal)]">
              Open to curious learners at every stage
            </h3>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-5">
            {[
              {
                label: "Aspiring and practicing beekeepers",
                bg: "bg-[#FFE7A8]"
              },
              {
                label: "Farmers exploring pollination support for crops",
                bg: "bg-[#FFF3C7]"
              },
              {
                label: "Individuals exploring beekeeping for commercial purposes",
                bg: "bg-[#FFE0E2]"
              },
              {
                label: "Students, educators, and researchers",
                bg: "bg-[#E3F0FF]"
              },
              {
                label: "Nature lovers, gardeners, and urban residents",
                bg: "bg-[#FFD9B0]"
              }
            ].map((item, index) => (
              <div
                key={item.label}
                className={`${item.bg} rounded-3xl px-4 pt-6 pb-5 flex flex-col items-center text-center shadow-sm border border-black/5`}
              >
                <div className="w-14 h-14 rounded-full bg-black text-[var(--color-academia-cream)] flex items-center justify-center mb-4 text-xl font-serif">
                  {index + 1}
                </div>
                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative min-h-[180px] md:min-h-[200px] bg-[#A5C7A0] text-black flex flex-col items-center justify-center text-center px-6">
              <EmpathySvg />
              <p className="mt-4 text-sm md:text-base font-medium max-w-xs">
                Builds empathy for pollinators and ecosystems
              </p>
            </div>
            <div className="relative min-h-[180px] md:min-h-[200px] bg-[#FFB5C5] text-black flex flex-col items-center justify-center text-center px-6">
              <FoodSvg />
              <p className="mt-4 text-sm md:text-base font-medium max-w-xs">
                Improves understanding of food, agriculture, and field realities
              </p>
            </div>
            <div className="relative min-h-[180px] md:min-h-[200px] bg-[#FFC47A] text-black flex flex-col items-center justify-center text-center px-6">
              <ChoicesSvg />
              <p className="mt-4 text-sm md:text-base font-medium max-w-xs">
                Encourages informed, conscious choices in everyday life
              </p>
            </div>
            <div className="relative min-h-[180px] md:min-h-[200px] bg-[#99C8F5] text-black flex flex-col items-center justify-center text-center px-6">
              <FarmingSvg />
              <p className="mt-4 text-sm md:text-base font-medium max-w-xs">
                Supports sustainable farming, biodiversity, and long-term resilience
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BeehiveTraining;
