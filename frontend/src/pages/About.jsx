import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiLinkedin, FiGlobe } from "react-icons/fi";
import founderPhoto from "../../founder_photo.jpeg";
import coFounderPhoto from "../../co-founder.jpeg";

const stats = [
  { label: "Founding Year", value: 2026, suffix: "" },
  { label: "Research Mentors & Partners", value: 20, suffix: "+" },
  { label: "Student Journeys Guided", value: 100, suffix: "+" },
];

const milestones = [
  {
    year: "Concept",
    title: "Idea incubated",
    text:
      "Originated from mentoring sessions where students and supervisors needed clearer ways to align expectations and research directions.",
  },
  {
    year: "Pilot",
    title: "Workflows tested",
    text:
      "Early Deep Academia flows were piloted with research scholars, faculty, and industry mentors to validate real-world fit.",
  },
  {
    year: "2026",
    title: "Studio registered",
    text:
      "Shaun Spherix Solutions LLP formally registered on 16/02/2026 to build focused research intelligence and mentorship platforms.",
  },
];

const founderQuoteSonia =
  "Ethical research, sustainable innovation, and meaningful mentorship can transform academic trajectories.";

const founderQuotePradeep =
  "Structured execution turns bold ideas into systems that actually ship and sustain.";

const founderBioSoniaParagraphs = [
  "Dr. Sonia Maria D'Souza is a distinguished academician, researcher, and innovation leader with over 18 years of experience in higher education, research, and academic administration. She is an Associate Professor in the Department of Artificial Intelligence and Machine Learning at New Horizon College of Engineering, Bengaluru. She holds a Ph.D. in Computer Science and Engineering and has completed Post-Doctoral research in Disruptive Technologies from UNESCO, Brazil.",
  "Her expertise spans Artificial Intelligence, Machine Learning, Data Analytics, Disruptive Technologies, and Emerging Intelligent Systems. She has published extensively in reputed international journals and conferences, contributed to patents and funded research projects, and led several interdisciplinary innovation initiatives.",
  "As Founder of Shaun Spherix Solutions LLP, Dr. Sonia brings strategic vision, research-driven thinking, and deep academic–industry integration. She mentors startups and research scholars, designs Faculty Development Programs, and builds innovation ecosystems through incubation and institutional collaboration. Her leadership is grounded in ethical research practices, sustainable innovation, and using technology for societal empowerment.",
];

const founderBioPradeepParagraphs = [
  "Mr. Pradeep Kumar Victor is a dynamic professional with strong technical acumen and entrepreneurial insight. As Co-Founder, he plays a pivotal role in operational strategy, technology implementation, and business development initiatives across the studio's products.",
  "With expertise in technology management, system implementation, and strategic execution, he helps translate innovative ideas into scalable, production-ready solutions. His hands-on approach, problem‑solving mindset, and focus on quality ensure that projects are executed efficiently and sustainably.",
  "Pradeep brings a grounded industry perspective and structured planning capabilities to Shaun Spherix. He supports product development, deployment strategies, client engagement, and technical optimization, while his collaborative leadership style strengthens team coordination and maintains a results‑driven culture.",
];

const Stat = ({ label, value, suffix }) => {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? value : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }
    let frame;
    const duration = 1200;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, shouldReduceMotion]);

  return (
    <div className="space-y-1">
      <p className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-academia-charcoal)]">
        {display}
        {suffix}
      </p>
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
    </div>
  );
};

const FounderCard = ({
  roleLabel,
  name,
  title,
  photo,
  quote,
  paragraphs,
  linkedin,
  website,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [typedQuote, setTypedQuote] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!quote) return;
    if (shouldReduceMotion) {
      setTypedQuote(quote);
      return;
    }
    if (hasTyped) return;
    let index = 0;
    setTypedQuote("");
    const id = setInterval(() => {
      index += 1;
      setTypedQuote(quote.slice(0, index));
      if (index >= quote.length) {
        clearInterval(id);
        setHasTyped(true);
      }
    }, 25);
    return () => clearInterval(id);
  }, [quote, shouldReduceMotion, hasTyped]);

  const visibleParagraphs = expanded ? paragraphs : paragraphs.slice(0, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="group bg-white border border-stone-200 rounded-2xl shadow-sm p-8 flex gap-6 items-start relative overflow-hidden"
    >
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[var(--color-academia-gold)]/10 blur-3xl" />
      )}
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-200 shadow-md flex-shrink-0 transform transition-transform duration-500 group-hover:scale-105">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[var(--color-academia-charcoal)]/40"
        >
          <span className="text-xs font-semibold bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] px-3 py-1 rounded-full">
            Watch intro
          </span>
        </button>
      </div>
      <div className="space-y-3 relative z-10">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
          {roleLabel}
        </p>
        <p className="text-xl md:text-2xl font-serif font-bold">{name}</p>
        <p className="text-sm text-stone-600">{title}</p>
        {quote && (
          <p className="text-sm text-[var(--color-academia-charcoal)] italic border-l-2 border-[var(--color-academia-gold)] pl-3">
            {typedQuote}
          </p>
        )}
        <div className="space-y-2 text-sm text-stone-500 leading-relaxed">
          {visibleParagraphs.map((text) => (
            <p key={text.slice(0, 32)}>{text}</p>
          ))}
        </div>
        {paragraphs.length > 1 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 inline-flex items-center text-xs font-semibold tracking-wide text-[var(--color-academia-charcoal)] border-b border-dashed border-[var(--color-academia-charcoal)]/40 hover:border-[var(--color-academia-gold)]"
          >
            {expanded ? "Show less" : "Read full bio"}
          </button>
        )}
        <div className="flex gap-3 pt-4">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:text-[var(--color-academia-gold)] hover:border-[var(--color-academia-gold)] transition transform hover:-translate-y-0.5"
            >
              <FiLinkedin />
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:text-[var(--color-academia-gold)] hover:border-[var(--color-academia-gold)] transition transform hover:-translate-y-0.5"
            >
              <FiGlobe />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const companyRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: companyRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const handleHeroMouseMove = (event) => {
    if (!heroRef.current || shouldReduceMotion) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setCursor({ x, y });
  };

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
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          className="relative grid md:grid-cols-2 gap-10 items-start overflow-hidden rounded-3xl border border-stone-200 bg-[var(--color-academia-cream)]/80 shadow-[0_24px_80px_rgba(0,0,0,0.1)] p-8 md:p-10"
        >
          {!shouldReduceMotion && (
            <>
              <motion.div
                className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(197,160,40,0.13),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(34,34,34,0.16),_transparent_55%)]"
                style={{ x: cursor.x * 0.04, y: cursor.y * 0.04 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
              <motion.div
                className="pointer-events-none absolute w-40 h-40 rounded-full bg-[rgba(197,160,40,0.16)] blur-3xl"
                style={{ x: cursor.x * 0.1, y: cursor.y * 0.1 }}
              />
            </>
          )}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-academia-cream)] border border-[var(--color-academia-gold)]/40 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-academia-gold)]">
              <span>Our Vision</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Bridging rigorous research, real-world impact, and mentor-led guidance.
            </h1>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              At Shaun Spherix Solutions LLP, the vision is to make serious research
              mentorship accessible and structured. The studio designs Deep Academia
              platforms that help students and scholars surface methodology gaps, align with
              supervisors, and discover opportunities that match their readiness and goals.
            </p>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              Every workflow is built to reduce noise and uncertainty. Instead of generic
              checklists, Shaun Spherix focuses on calibrated journeys that respect time,
              attention, and the long horizon of research careers.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {stats.map((stat) => (
                <Stat
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                />
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8 flex flex-col justify-between gap-6 relative z-10"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)]">
                Our Promise
              </p>
              <p className="text-base md:text-lg text-[var(--color-academia-charcoal)] font-serif font-semibold">
                To be the quiet, precise layer between motivated learners and the mentors,
                labs, and funding that can transform their work.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                The platforms built by Shaun Spherix nurture confidence, clarify expectations
                between mentors and students, and turn research intent into structured,
                trackable progress.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  Registered On
                </p>
                <p className="text-[var(--color-academia-charcoal)] font-medium">
                  16/02/2026
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  DIN
                </p>
                <p className="text-[var(--color-academia-charcoal)] font-medium">
                  11541916
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  Focus
                </p>
                <p className="text-[var(--color-academia-charcoal)] font-medium">
                  Deep Academia Platforms
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  Based In
                </p>
                <p className="text-[var(--color-academia-charcoal)] font-medium">
                  Bengaluru, India
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          ref={companyRef}
          className="relative py-10 md:py-16"
        >
          {!shouldReduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{ y: parallaxY }}
            >
              <div className="mx-auto max-w-5xl h-full bg-[radial-gradient(circle_at_top,_rgba(34,34,34,0.09),_transparent_60%)] opacity-70" />
            </motion.div>
          )}
          <div className="space-y-4 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
              Company Journey
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-academia-charcoal)]">
              From academic hallways to focused research platforms.
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              Shaun Spherix Solutions LLP grew from mentoring conversations where students,
              supervisors, and industry partners needed clearer, shared context. Today, the
              studio builds platforms that align expectations, surface gaps, and make serious
              research pathways more transparent.
            </p>
          </div>
          <ol className="mt-8 space-y-4">
            {milestones.map((item, index) => (
              <motion.li
                key={item.title + item.year}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex gap-4 items-start"
              >
                <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] text-xs font-semibold">
                  {item.year}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--color-academia-charcoal)]">
                    {item.title}
                  </p>
                  <p className="text-xs md:text-sm text-stone-600">{item.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </section>

        <section className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
              Founding Team
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-academia-charcoal)]">
              The people behind Shaun Spherix Solutions LLP.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <FounderCard
              roleLabel="Founder"
              name="Dr. Sonia Maria D'Souza"
              title="Founder & Director, Shaun Spherix Solutions LLP"
              photo={founderPhoto}
              quote={founderQuoteSonia}
              paragraphs={founderBioSoniaParagraphs}
              linkedin="#"
              website="#"
            />
            <FounderCard
              roleLabel="Co-Founder"
              name="Mr. Pradeep Kumar V"
              title="Co-Founder, Shaun Spherix Solutions LLP"
              photo={coFounderPhoto}
              quote={founderQuotePradeep}
              paragraphs={founderBioPradeepParagraphs}
              linkedin="#"
              website="#"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

