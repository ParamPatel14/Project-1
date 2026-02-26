import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiUsers, FiAward, FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import NetworkVisualization from '../components/NetworkVisualization';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] font-sans overflow-x-hidden">
      <nav className="fixed w-full top-0 z-50 bg-[var(--color-academia-cream)]/90 backdrop-blur-md border-b border-stone-200/50">
        <div className="px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--color-academia-charcoal)] rounded-sm flex items-center justify-center text-[var(--color-academia-cream)] font-serif font-bold text-lg md:text-xl shadow-lg">
              R
            </div>
            <span className="text-sm md:text-xl font-bold tracking-tight font-serif truncate max-w-[200px] md:max-w-none">Shaun Spherix Solutions LLP</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              to="/about"
              className="text-sm font-medium hover:text-[var(--color-academia-gold)] transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-academia-gold)] transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/login" className="text-sm font-medium hover:text-[var(--color-academia-gold)] transition-colors relative group">
              Log In
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-academia-gold)] transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] text-sm font-medium rounded-sm hover:bg-stone-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Join the Network
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--color-academia-charcoal)] focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--color-academia-cream)] border-b border-stone-200 shadow-lg z-40 p-6 flex flex-col gap-4 animate-fade-in">
             <Link 
               to="/about" 
               className="text-lg font-medium text-[var(--color-academia-charcoal)] py-2 border-b border-stone-100"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               About
             </Link>
             <Link 
               to="/login" 
               className="text-lg font-medium text-[var(--color-academia-charcoal)] py-2 border-b border-stone-100"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Log In
             </Link>
             <Link 
               to="/register" 
               className="text-lg font-medium text-[var(--color-academia-gold-hover)] py-2 font-serif"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Join the Network →
             </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 md:pt-20 min-h-screen flex flex-col lg:flex-row">
        {/* Left Content */}
        <div className="lg:w-1/2 flex items-center justify-center px-4 md:px-8 py-12 md:py-20 lg:py-0 relative z-10">
          <div className="max-w-xl space-y-6 md:space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 md:px-4 md:py-1.5 border border-[var(--color-academia-gold)] text-[var(--color-academia-gold-hover)] text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-sm bg-[var(--color-academia-gold)]/5"
            >
              Academic Intelligence
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight text-[var(--color-academia-charcoal)]"
            >
              A mentor empowers you to see a possible{' '}
              <span className="text-[var(--color-academia-gold)] italic relative inline-block">
                future
                <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-[var(--color-academia-gold)] opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
              ,<br/>
              and believe it can be obtained.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs md:text-sm text-stone-500 italic"
            >
              “A mentor empowers a person to see a possible future, and believe it can be obtained.” – Shawn Hitchcock
            </motion.p>

            {/* Removed tagline paragraph per user request */}            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 flex-wrap"
            >
              <Link to="/register" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] font-medium rounded-sm hover:bg-stone-900 transition-all flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base">
                Start Researching <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-transparent border border-[var(--color-academia-charcoal)] text-[var(--color-academia-charcoal)] font-medium rounded-sm hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-all flex items-center justify-center shadow-sm hover:shadow-lg text-sm md:text-base">
                Explore Mentors
              </Link>
              <Link
                to="/beehive"
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] font-medium rounded-sm hover:bg-[var(--color-academia-gold-hover)] transition-all flex items-center justify-center shadow-sm hover:shadow-lg text-sm md:text-base"
              >
                BeeHive Training
              </Link>
            </motion.div>
            
            {/* Removed hero stats strip with placeholder data per user request */}
          </div>
        </div>

        <div className="lg:w-1/2 relative h-[50vh] lg:h-auto bg-[var(--color-academia-cream)] overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <NetworkVisualization />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-academia-cream)] to-transparent w-16 pointer-events-none hidden lg:block"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-academia-cream)] to-transparent h-16 pointer-events-none lg:hidden"></div>
          </div>
            
            
        </div>
      </header>
      
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-academia-gold)] to-transparent opacity-30"></div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
                { 
                  title: "Methodology Gaps", 
                  desc: "Identify under-explored areas in your domain using our Gemini-powered analysis engine.",
                  icon: <FiSearch size={28} />
                },
                { 
                  title: "Smart Alignment", 
                  desc: "Match with supervisors whose research interests and mentorship styles align with your profile.",
                  icon: <FiUsers size={28} />
                },
                { 
                  title: "Verifiable Impact", 
                  desc: "Generate blockchain-backed certificates for your contributions and research internships.",
                  icon: <FiAward size={28} />
                }
            ].map((feature, idx) => (
                <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group p-6 md:p-8 bg-white border border-stone-100 rounded-sm shadow-sm hover:shadow-xl hover:border-[var(--color-academia-gold)]/30 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 text-[var(--color-academia-gold)]">
                       <div className="scale-150">{feature.icon}</div>
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[var(--color-academia-cream)] rounded-full flex items-center justify-center text-[var(--color-academia-gold)] mb-4 md:mb-6 group-hover:bg-[var(--color-academia-charcoal)] group-hover:text-[var(--color-academia-gold)] transition-colors duration-300 shadow-inner">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-serif font-bold mb-2 md:mb-3 group-hover:text-[var(--color-academia-gold-hover)] transition-colors">{feature.title}</h3>
                    <p className="text-stone-600 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      <section className="px-4 md:px-8 pb-12 md:pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-stone-200 rounded-sm shadow-sm px-6 py-6 md:px-8 md:py-8 flex items-center justify-between gap-6 flex-col md:flex-row"
        >
          <div className="space-y-2 max-w-xl">
            <p className="text-[10px] md:text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-academia-gold)]">
              Behind the Platform
            </p>
            <p className="text-lg md:text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">
              Crafted by educators and mentors for serious academic journeys.
            </p>
            <p className="text-xs md:text-sm text-stone-500">
              Shaun Spherix Solutions LLP is led by academics and operators who live inside
              research ecosystems. Learn more about the studio, its founders, and the ethos
              behind the platform.
            </p>
          </div>
          <Link
            to="/about"
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-sm border border-[var(--color-academia-charcoal)] text-sm font-semibold text-[var(--color-academia-charcoal)] hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-all"
          >
            Meet the Founders
          </Link>
        </motion.div>
      </section>

      <footer className="mt-12 md:mt-16 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12 grid gap-8 md:gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-sm bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] flex items-center justify-center font-serif font-bold text-base md:text-lg">
                R
              </div>
              <span className="text-base md:text-lg font-serif font-semibold tracking-tight">Shaun Spherix Solutions LLP</span>
            </div>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              Shaun Spherix Solutions LLP builds platforms to help students and researchers build meaningful academic collaborations.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-[var(--color-academia-gold)]">
              Company
            </h3>
            <div className="space-y-1 text-xs md:text-sm text-stone-200">
              <p className="font-medium">Shaun Spherix Solutions LLP</p>
              <p>Founder & Director: Dr. Sonia Maria D&apos;Souza</p>
              <p>Co-Founder: Mr. Pradeep Kumar V</p>
              <p>Formed on: 10/02/2026</p>
              <p>DIN: 11541916</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-[var(--color-academia-gold)]">
              Crafted By
            </h3>
            <p className="text-xs md:text-sm text-stone-200 leading-relaxed">
              Platform engineered by Param Patel.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col gap-2 text-[10px] md:text-xs text-stone-400 md:flex-row md:items-center md:justify-between">
            <span>
              © {new Date().getFullYear()} Shaun Spherix Solutions LLP. All rights reserved.
            </span>
            <span>
              Company registered in India · DIN 11541916
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
