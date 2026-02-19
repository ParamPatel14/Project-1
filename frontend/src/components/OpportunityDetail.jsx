import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOpportunity, applyForOpportunity, analyzeMatch, generateAICoverLetter, generateImprovementPlan } from '../api';
import { FiClock, FiUsers, FiCheckCircle, FiCpu, FiArrowLeft, FiBriefcase, FiAward, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ConnectingNodes from './ConnectingNodes';
import CubeLoader from './ui/CubeLoader';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });

  // Match Preview State
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchPreview, setMatchPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  
  // Loading Animation State
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Analyzing your profile...",
    "Scanning opportunity requirements...",
    "Matching skills and experience...",
    "Calculating final score..."
  ];

  useEffect(() => {
    let interval;
    if (previewLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [previewLoading]);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const data = await getOpportunity(id);
      setOpportunity(data);
    } catch (err) {
      setError("Failed to load opportunity details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const score = matchPreview ? matchPreview.score : null;
      const details = matchPreview ? matchPreview : null;
      
      await applyForOpportunity(id, coverLetter, score, details);
      
      setApplyMessage({ type: 'success', text: 'Application submitted successfully!' });
      setTimeout(() => {
        setShowApplyModal(false);
        setApplyMessage({ type: '', text: '' });
        setCoverLetter('');
      }, 2000);
    } catch (err) {
      setApplyMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to submit application.' });
    }
  };

  const handleCheckMatch = async () => {
    setShowMatchModal(true);
    setMatchPreview(null);
    setPreviewError('');
    setPreviewLoading(true);

    try {
      const data = await analyzeMatch(id);
      setMatchPreview(data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
         setPreviewError("Session expired or unauthorized. Redirecting to login...");
         setTimeout(() => navigate('/login'), 2000);
      } else {
         setPreviewError(err.response?.data?.detail || "Failed to analyze match");
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      const data = await generateAICoverLetter(id);
      setCoverLetter(data.cover_letter);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to generate cover letter");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleImproveChances = async () => {
    if (!window.confirm("Generate an improvement plan for this opportunity? This will analyze your gaps and create tasks.")) return;
    try {
        await generateImprovementPlan(id);
        navigate('/improvement-plans');
    } catch (err) {
        alert(err.response?.data?.detail || "Failed to generate improvement plan");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[var(--color-academia-cream)]">
        <CubeLoader />
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-600 mt-10 font-serif bg-[var(--color-academia-cream)] h-screen pt-10">
        {error}
    </div>
  );
  
  if (!opportunity) return <div className="text-center mt-10 bg-[var(--color-academia-cream)] h-screen pt-10">Opportunity not found.</div>;

  return (
    <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)} 
            className="flex items-center text-stone-600 hover:text-[var(--color-academia-charcoal)] mb-6 transition group"
        >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Opportunities
        </motion.button>

        {/* Hero Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--color-academia-charcoal)] rounded-sm shadow-xl overflow-hidden mb-8 relative"
        >
            {/* Background 3D Effect - subtle */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
                 <ConnectingNodes />
            </div>

            <div className="relative z-10 p-8 md:p-12 text-[var(--color-academia-cream)] flex flex-col md:flex-row justify-between gap-8">
                <div className="md:w-2/3">
                    <div className="flex items-center gap-2 mb-3 text-[var(--color-academia-gold)] uppercase tracking-widest text-xs font-bold">
                        <FiBookOpen /> {opportunity.type.replace('_', ' ')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">{opportunity.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-stone-300 mb-6 font-light">
                        {opportunity.deadline && (
                            <span className="flex items-center"><FiClock className="mr-2 text-[var(--color-academia-gold)]"/> Open till: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        )}
                        <span className="flex items-center"><FiUsers className="mr-2 text-[var(--color-academia-gold)]"/> {opportunity.total_slots || 1} Slots Available</span>
                    </div>

                    {opportunity.mentor && (
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/10 max-w-md">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] flex items-center justify-center font-bold text-xl shadow-md">
                                {opportunity.mentor.name ? opportunity.mentor.name.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div>
                                <p className="text-xs text-[var(--color-academia-gold)] uppercase font-bold tracking-wide">Research Lead</p>
                                <p className="font-serif text-lg text-white">{opportunity.mentor.name || 'Unknown Mentor'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:w-1/3 flex flex-col justify-center items-end">
                    {opportunity.funding_amount > 0 && (
                        <div className="bg-[var(--color-academia-gold)] text-[var(--color-academia-charcoal)] p-6 rounded-sm text-center shadow-lg w-full md:w-auto">
                            <p className="text-xs uppercase font-bold tracking-wider mb-1 opacity-80">Grant Funding</p>
                            <p className="text-3xl font-serif font-bold">{opportunity.currency} {opportunity.funding_amount.toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-2 space-y-8"
            >
                <section className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-[var(--color-academia-charcoal)]">
                    <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center">
                        <FiCheckCircle className="mr-3 text-[var(--color-academia-gold)]"/> 
                        Project Overview
                    </h3>
                    <div className="text-stone-700 leading-relaxed text-lg whitespace-pre-line">
                        {opportunity.description}
                    </div>
                </section>
                
                <section className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-[var(--color-academia-gold)]">
                    <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center">
                        <FiAward className="mr-3 text-[var(--color-academia-gold)]"/> 
                        Prerequisites
                    </h3>
                    <div className="text-stone-700 leading-relaxed text-lg whitespace-pre-line">
                        {opportunity.requirements}
                    </div>
                </section>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
            >
                <div className="bg-white p-6 rounded-sm shadow-md border border-stone-200 sticky top-8">
                    <h4 className="font-serif font-bold text-xl text-[var(--color-academia-charcoal)] mb-6 border-b border-stone-100 pb-2">
                        Next Steps
                    </h4>
                    {opportunity.is_open ? (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setShowApplyModal(true)} 
                                className="w-full bg-[var(--color-academia-charcoal)] hover:bg-stone-800 text-[var(--color-academia-cream)] font-bold py-4 px-6 rounded-sm transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Submit Proposal
                            </button>
                            
                            <button 
                                onClick={handleCheckMatch} 
                                className="w-full bg-white hover:bg-stone-50 text-[var(--color-academia-charcoal)] border-2 border-[var(--color-academia-charcoal)] font-bold py-3 px-6 rounded-sm transition flex items-center justify-center gap-2"
                            >
                                <FiCpu className="text-[var(--color-academia-gold)]" /> AI Alignment Check
                            </button>
                            
                            <button 
                                onClick={handleImproveChances} 
                                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold py-3 px-6 rounded-sm transition text-sm"
                            >
                                Identify Gaps & Improve
                            </button>
                        </div>
                    ) : (
                        <div className="bg-stone-100 text-stone-500 p-4 rounded-sm text-center font-bold border border-stone-200">
                            Applications Closed
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-[var(--color-academia-charcoal)]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm max-w-2xl w-full mx-4 shadow-2xl overflow-hidden border-t-4 border-[var(--color-academia-gold)]"
          >
            <div className="bg-[var(--color-academia-cream)] px-8 py-6 border-b border-stone-200 flex justify-between items-center">
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">Submit Application</h3>
                <button onClick={() => setShowApplyModal(false)} className="text-stone-400 hover:text-[var(--color-academia-charcoal)] text-2xl">&times;</button>
            </div>
            <div className="p-8">
                {applyMessage.text && (
                    <div className={`p-4 rounded-sm mb-6 font-medium ${applyMessage.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-green-50 text-green-800 border-l-4 border-green-500'}`}>
                    {applyMessage.text}
                    </div>
                )}
                <form onSubmit={handleApplySubmit}>
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-[var(--color-academia-charcoal)] font-bold font-serif text-lg">Cover Letter</label>
                        <button
                            type="button"
                            onClick={handleGenerateCoverLetter}
                            disabled={isGeneratingCoverLetter}
                            className="text-sm bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] px-4 py-2 rounded-sm hover:bg-[var(--color-academia-gold)]/20 border border-[var(--color-academia-gold)] flex items-center gap-2 transition disabled:opacity-50 font-medium"
                        >
                            <FiCpu className="text-[var(--color-academia-gold)]" /> Generate with AI
                        </button>
                    </div>
                    <div className="relative">
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full px-4 py-4 border border-stone-300 rounded-sm focus:ring-2 focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)] transition mb-6 min-h-[250px] font-serif text-lg leading-relaxed"
                            rows="8"
                            placeholder="Detail your research interests and alignment with this project..."
                            required
                            disabled={isGeneratingCoverLetter}
                        />
                        {isGeneratingCoverLetter && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-sm border border-[var(--color-academia-gold)] z-10">
                                <div className="relative mb-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-academia-gold)]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FiCpu className="text-[var(--color-academia-gold)] text-lg animate-pulse"/>
                                    </div>
                                </div>
                                <p className="text-[var(--color-academia-charcoal)] font-serif text-lg font-medium animate-pulse">AI is crafting your narrative...</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setShowApplyModal(false)} className="px-6 py-3 text-stone-600 hover:text-[var(--color-academia-charcoal)] font-medium transition">Cancel</button>
                        <button type="submit" disabled={isGeneratingCoverLetter} className="bg-[var(--color-academia-charcoal)] hover:bg-stone-800 text-[var(--color-academia-cream)] px-8 py-3 rounded-sm font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">Submit Application</button>
                    </div>
                </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Match Preview Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-[var(--color-academia-charcoal)]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm max-w-lg w-full mx-4 shadow-2xl p-8 relative border-t-4 border-[var(--color-academia-gold)]"
          >
            <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-[var(--color-academia-charcoal)]">
                <FiCpu className="text-[var(--color-academia-gold)] text-3xl"/> AI Alignment Analysis
            </h3>
            
            {previewLoading ? (
                <div className="flex flex-col items-center py-12 px-4 text-center">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-[var(--color-academia-cream)] rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-[var(--color-academia-gold)] rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <FiCpu className="text-[var(--color-academia-gold)] text-2xl animate-bounce"/>
                        </div>
                    </div>
                    <h4 className="text-xl font-bold text-[var(--color-academia-charcoal)] mb-3 font-serif">{loadingMessages[loadingStep]}</h4>
                    <p className="text-stone-500 max-w-xs">Comparing your academic profile against project requirements.</p>
                </div>
            ) : previewError ? (
                <p className="text-red-600 bg-red-50 p-4 rounded-sm border border-red-200">{previewError}</p>
            ) : matchPreview && (
                <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-[var(--color-academia-cream)] rounded-sm border border-[var(--color-academia-gold)]/30">
                        <div className={`text-6xl font-serif font-bold ${
                            matchPreview.score >= 80 ? 'text-green-700' :
                            matchPreview.score >= 50 ? 'text-[var(--color-academia-gold)]' : 'text-red-700'
                        }`}>
                            {matchPreview.score}%
                        </div>
                        <div>
                            <p className="text-[var(--color-academia-charcoal)] text-sm uppercase font-bold tracking-wider mb-1">Alignment Score</p>
                            <p className="text-sm text-stone-600">Based on skills, publications & methodology</p>
                        </div>
                    </div>
                    
                    <div className="bg-stone-50 p-6 rounded-sm border-l-4 border-[var(--color-academia-charcoal)]">
                        <h5 className="font-bold text-[var(--color-academia-charcoal)] mb-2 font-serif">Analysis</h5>
                        <p className="text-stone-700 leading-relaxed">{matchPreview.explanation}</p>
                    </div>

                    {matchPreview.missing_skills && matchPreview.missing_skills.length > 0 && (
                        <div className="bg-red-50 p-6 rounded-sm border border-red-100">
                            <h5 className="font-bold text-red-900 mb-3 font-serif">Gap Analysis (Missing Skills)</h5>
                            <div className="flex flex-wrap gap-2">
                                {matchPreview.missing_skills.map((s, i) => (
                                    <span key={i} className="bg-white text-red-700 px-3 py-1 rounded-sm border border-red-200 text-sm font-medium shadow-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="mt-8 flex justify-end">
                <button onClick={() => setShowMatchModal(false)} className="bg-stone-100 text-stone-700 px-6 py-2 rounded-sm hover:bg-stone-200 font-bold transition">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetail;
