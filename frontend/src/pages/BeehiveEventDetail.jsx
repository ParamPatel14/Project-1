import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBeehiveEvents, enrollBeehive, createBeehiveContact } from '../api';
import { FiHexagon, FiClock, FiUsers, FiMapPin, FiArrowLeft, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import contactHero from '../../contactus1 (1).avif';
import CubeLoader from '../components/ui/CubeLoader';

const BeehiveEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(!location.state?.event);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState(null);
  const [contactForm, setContactForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    interests: [],
    message: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState(null);

  useEffect(() => {
    if (event) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const events = await getBeehiveEvents();
        const found = events.find((e) => String(e.id) === String(id));
        if (!found) {
          setError('This Beehive event could not be found. It may have been updated or removed.');
        } else {
          setEvent(found);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event, id]);

  const handleBack = () => {
    if (location.state?.from === 'beehive-list') {
      navigate(-1);
    } else {
      navigate('/beehive');
    }
  };

  const handleEnroll = async () => {
    if (!event || enrolling) return;

    const confirmed = window.confirm(
      `This event has an entry fee of ₹${event.entry_fee}. Confirm enrollment?`
    );
    if (!confirmed) return;

    try {
      setEnrolling(true);
      setEnrollMessage(null);
      await enrollBeehive(event.id);
      setEnrollMessage({
        type: 'success',
        text: 'Enrolled successfully! Payment status is pending.'
      });
    } catch (err) {
      setEnrollMessage({
        type: 'error',
        text: err.response?.data?.detail || err.message || 'Failed to enroll.'
      });
    } finally {
      setEnrolling(false);
    }
  };

  const toggleInterest = (value) => {
    setContactForm((prev) => {
      const exists = prev.interests.includes(value);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== value)
          : [...prev.interests, value],
      };
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (contactSubmitting) return;

    setContactStatus(null);
    try {
      setContactSubmitting(true);
      await createBeehiveContact({
        first_name: contactForm.first_name,
        last_name: contactForm.last_name || null,
        phone: contactForm.phone || null,
        email: contactForm.email,
        interests: contactForm.interests.join(', '),
        message: contactForm.message || '',
        event_id: event.id,
      });
      setContactStatus({
        type: 'success',
        text: 'Thanks for reaching out. The HoneyDay team will contact you soon.',
      });
      setContactForm({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        interests: [],
        message: '',
      });
    } catch (err) {
      setContactStatus({
        type: 'error',
        text:
          err.response?.data?.detail ||
          'Failed to submit your details. Please try again.',
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-academia-cream)]">
        <CubeLoader />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-sm shadow-md border border-stone-200 p-8 text-center">
          <p className="text-sm text-stone-600 mb-4">{error || 'Event not found.'}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[var(--color-academia-charcoal)] text-sm font-medium text-[var(--color-academia-charcoal)] hover:bg-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-cream)] transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Beehive
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString();
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] font-sans">
      <header className="w-full border-b border-stone-200 bg-[var(--color-academia-cream)]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-9xl mx-auto px-8 h-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-stone-600 hover:text-[var(--color-academia-charcoal)]"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Beehive
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-sm bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] flex items-center justify-center shadow-md">
              <FiHexagon className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs tracking-[0.2em] uppercase text-stone-500">Beehive Event</span>
              <span className="text-sm font-semibold tracking-tight">HoneyDay x Shaun Spherix Solutions LLP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-8 py-10 md:py-14 space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] rounded-[2rem] overflow-hidden shadow-xl relative"
        >
          <div className="absolute inset-0">
            <img
              src={contactHero}
              alt="Live beekeeping session at HoneyDay beehive"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-academia-charcoal)]/95 via-[var(--color-academia-charcoal)]/90 to-black/55" />
          </div>
          <div className="relative z-10 p-8 md:p-10 lg:p-12 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[var(--color-academia-gold)]">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[var(--color-academia-gold)]/40">
                <FiHexagon className="w-4 h-4" />
                Beehive Event
              </span>
              <span className="text-[10px] font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Running
              </span>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-stone-200">
                <span className="inline-flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-[var(--color-academia-gold)]" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-[var(--color-academia-gold)]" />
                  {formattedTime} · {event.duration_hours}h
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-[var(--color-academia-gold)]" />
                  {event.max_seats} seats
                </span>
              </div>
            </div>

            <div className="mt-2 flex flex-col md:flex-row gap-6 items-stretch">
              <div className="md:flex-1">
                <p className="text-sm md:text-base leading-relaxed text-stone-100">
                  {event.description}
                </p>
              </div>
              <div className="md:w-64 bg-[var(--color-academia-cream)] text-[var(--color-academia-charcoal)] rounded-xl p-5 shadow-md flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
                    Entry
                  </p>
                  <div className="flex items-baseline gap-2">
                    <FiDollarSign className="text-[var(--color-academia-gold)]" />
                    <span className="text-2xl font-serif font-bold">₹{event.entry_fee}</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Weekend real-world mentorship hosted with HoneyDay at the live beehive site.
                  </p>
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="mt-4 w-full inline-flex justify-center items-center px-4 py-3 rounded-sm text-sm font-semibold border border-[var(--color-academia-charcoal)] bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] hover:bg-stone-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {enrolling ? 'Enrolling…' : `Join Beehive (₹${event.entry_fee})`}
                </button>
              </div>
            </div>

            {enrollMessage && (
              <div
                className={`mt-4 text-xs md:text-sm rounded-sm px-4 py-3 border ${
                  enrollMessage.type === 'success'
                    ? 'bg-green-50/10 border-green-300/50 text-green-100'
                    : 'bg-red-50/10 border-red-300/50 text-red-100'
                }`}
              >
                {enrollMessage.text}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          <div className="md:col-span-2 space-y-4">
            <div className="p-6 rounded-sm bg-white border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 mb-2">
                What this session feels like
              </p>
              <p className="text-sm md:text-base text-stone-800 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
            <div className="p-6 rounded-sm bg-white border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-500 mb-2">
                Who joins
              </p>
              <p className="text-sm md:text-base text-stone-800 leading-relaxed">
                Aspiring beekeepers, students, researchers, and nature lovers exploring
                sustainability and systems thinking in a real-world setting.
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="rounded-sm bg-[var(--color-academia-gold)]/10 border border-[var(--color-academia-gold)]/40 p-5">
              <div className="flex items-start gap-3">
                <FiUsers className="w-5 h-5 text-[var(--color-academia-gold)] mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-academia-gold)]">
                    Beehive Mentorship with Shaun Spherix Solutions LLP
                  </p>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    Completing this experience can be reflected as a Beehive Mentorship weekend on
                    your Shaun Spherix Solutions LLP profile, signalling hands-on exposure to sustainability and
                    systems thinking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
          <div className="rounded-[1.75rem] overflow-hidden bg-black/5">
            <img
              src={contactHero}
              alt="Contact HoneyDay and the Beehive team"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white rounded-[1.75rem] border border-stone-200 shadow-sm p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
                Get in touch
              </p>
              <h3 className="mt-2 text-xl md:text-2xl font-serif font-bold text-[var(--color-academia-charcoal)]">
                Talk to HoneyDay about this Beehive track
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                Share a few details and the team will reach out with next steps on
                training slots, equipment, or collaborations.
              </p>
            </div>

            {contactStatus && (
              <div
                className={`mb-4 text-xs md:text-sm rounded-sm px-4 py-3 border ${
                  contactStatus.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {contactStatus.text}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    First name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.first_name}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                    className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-academia-gold)]"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={contactForm.last_name}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                    className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-academia-gold)]"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-academia-gold)]"
                    placeholder="+91 ..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-academia-gold)]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-600 mb-2">
                  What are you interested in?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Other Beehive Products (Beeswax, Bee Pollen, etc.)',
                    'Beekeeping Training',
                    'Beekeeping Equipment',
                    'Bulk Orders / Corporate Gifting',
                    'B2B Enquiries',
                    'Other',
                  ].map((label) => (
                    <label
                      key={label}
                      className="inline-flex items-start gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 h-3 w-3 border-stone-400 rounded-sm text-[var(--color-academia-charcoal)] focus:ring-[var(--color-academia-gold)]"
                        checked={contactForm.interests.includes(label)}
                        onChange={() => toggleInterest(label)}
                      />
                      <span className="text-stone-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Your message
                </label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-academia-gold)] resize-none"
                  placeholder="Share your questions or context"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] text-xs md:text-sm font-semibold rounded-sm hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {contactSubmitting ? 'Submitting…' : 'Submit enquiry'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BeehiveEventDetail;
