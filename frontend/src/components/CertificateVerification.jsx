import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verifyCertificate } from '../api';
import { FiCheckCircle, FiSearch, FiAlertCircle, FiDownload, FiUser, FiCalendar, FiBriefcase, FiHash } from 'react-icons/fi';

const CertificateVerification = () => {
  const { uuid } = useParams(); // URL param if accessed directly
  const [certId, setCertId] = useState(uuid || '');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uuid) {
        handleVerify(uuid);
    }
  }, [uuid]);

  const handleVerify = async (idToVerify) => {
    if (!idToVerify) return;
    setLoading(true);
    setError('');
    setCertificate(null);
    try {
      const data = await verifyCertificate(idToVerify);
      setCertificate(data);
    } catch (err) {
      setError('Invalid Certificate ID or Certificate not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-sm border border-stone-200 font-sans animate-fade-in">
      <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-2 flex justify-center items-center gap-2">
            <FiCheckCircle className="text-[var(--color-academia-gold)]" /> Certificate Verification
          </h2>
          <p className="text-stone-500">Verify the authenticity of a Shaun Spherix Solutions LLP certificate</p>
      </div>
      
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-stone-400" />
            </div>
            <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter Certificate UUID"
                className="w-full pl-10 px-4 py-3 border border-stone-300 rounded-sm focus:outline-none focus:border-[var(--color-academia-gold)] focus:ring-1 focus:ring-[var(--color-academia-gold)] transition-colors bg-[var(--color-academia-cream)]"
            />
        </div>
        <button 
            onClick={() => handleVerify(certId)}
            disabled={loading}
            className="bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] px-6 py-3 rounded-sm hover:bg-stone-800 transition-colors font-medium shadow-md flex items-center gap-2 disabled:opacity-70"
        >
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-[var(--color-academia-gold)] rounded-full border-t-transparent"></div> : 'Verify'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-sm text-center mb-6 flex items-center justify-center gap-2">
            <FiAlertCircle /> {error}
        </div>
      )}

      {certificate && (
        <div className="border-t-2 border-[var(--color-academia-gold)] pt-8 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[var(--color-academia-gold)]">
                <FiCheckCircle size={32} />
            </div>

            <div className="text-center mb-8">
                <h3 className="text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">Valid Certificate</h3>
                <p className="text-stone-500 text-sm mt-1 uppercase tracking-widest">Official Record</p>
            </div>
            
            <div className="bg-[var(--color-academia-cream)] p-6 rounded-sm border border-stone-200 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                    <span className="text-stone-500 flex items-center gap-2"><FiUser /> Student ID</span>
                    <span className="font-serif font-bold text-[var(--color-academia-charcoal)] text-lg">{certificate.student_id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                    <span className="text-stone-500 flex items-center gap-2"><FiBriefcase /> Issued By (Mentor ID)</span>
                    <span className="font-serif font-bold text-[var(--color-academia-charcoal)] text-lg">{certificate.mentor_id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                    <span className="text-stone-500 flex items-center gap-2"><FiHash /> Opportunity ID</span>
                    <span className="font-serif font-bold text-[var(--color-academia-charcoal)] text-lg">{certificate.opportunity_id}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-stone-500 flex items-center gap-2"><FiCalendar /> Date Issued</span>
                    <span className="font-serif font-bold text-[var(--color-academia-charcoal)] text-lg">{new Date(certificate.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            
            <div className="mt-8 text-center">
                 <a 
                    href={certificate.pdf_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] transition-colors font-medium border-b-2 border-transparent hover:border-[var(--color-academia-gold)] pb-1"
                 >
                    <FiDownload /> Download Official PDF
                 </a>
            </div>
        </div>
      )}
    </div>
  );
};

export default CertificateVerification;
