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
        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
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
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8 flex flex-col justify-between gap-6">
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
          </div>
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
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 flex gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-200 shadow-md flex-shrink-0">
              <img
                src={founderPhoto}
                alt="Founder: Dr. Sonia Maria D'Souza"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
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
                Dr. Sonia Maria D&apos;Souza is a distinguished academician, researcher,
                and innovation leader with over 18 years of experience in higher education,
                research, and academic administration. She is an Associate Professor in the
                Department of Artificial Intelligence and Machine Learning at New Horizon
                College of Engineering, Bengaluru. She holds a Ph.D. in Computer Science and
                Engineering and has completed Post-Doctoral research in Disruptive
                Technologies from UNESCO, Brazil.
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Her expertise spans Artificial Intelligence, Machine Learning, Data
                Analytics, Disruptive Technologies, and Emerging Intelligent Systems. She
                has published extensively in reputed international journals and conferences,
                contributed to patents and funded research projects, and led several
                interdisciplinary innovation initiatives.
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                As Founder of Shaun Spherix Solutions LLP, Dr. Sonia brings strategic vision,
                research-driven thinking, and deep academic–industry integration. She mentors
                startups and research scholars, designs Faculty Development Programs, and
                builds innovation ecosystems through incubation and institutional
                collaboration. Her leadership is grounded in ethical research practices,
                sustainable innovation, and using technology for societal empowerment.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 flex gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-200 shadow-md flex-shrink-0">
              <img
                src={coFounderPhoto}
                alt="Co-Founder: Mr. Pradeep Kumar V"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3">
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
                Mr. Pradeep Kumar Victor is a dynamic professional with strong technical
                acumen and entrepreneurial insight. As Co-Founder, he plays a pivotal role
                in operational strategy, technology implementation, and business development
                initiatives across the studio&apos;s products.
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                With expertise in technology management, system implementation, and
                strategic execution, he helps translate innovative ideas into scalable,
                production-ready solutions. His hands-on approach, problem‑solving mindset,
                and focus on quality ensure that projects are executed efficiently and
                sustainably.
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Pradeep brings a grounded industry perspective and structured planning
                capabilities to Shaun Spherix. He supports product development, deployment
                strategies, client engagement, and technical optimization, while his
                collaborative leadership style strengthens team coordination and maintains a
                results‑driven culture.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

