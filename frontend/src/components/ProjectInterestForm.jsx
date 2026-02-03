import { useState, useEffect } from "react";
import { submitProjectInterest, getProjectInterests } from "../api";
import { useAuth } from "../context/AuthContext";
import { FiCpu, FiSend, FiList } from "react-icons/fi";

const ProjectInterestForm = () => {
  const { user } = useAuth();
  const [interest, setInterest] = useState("");
  const [submittedInterests, setSubmittedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInterests();
    }
  }, [user]);

  const fetchInterests = async () => {
    try {
      const data = await getProjectInterests(user.id);
      setSubmittedInterests(data);
    } catch (error) {
      console.error("Failed to fetch interests", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interest.trim()) return;

    setLoading(true);
    try {
      await submitProjectInterest({
        interest_area: interest,
        description: "Student submitted interest via dashboard." 
      });
      setInterest("");
      fetchInterests();
      alert("Interest submitted successfully!");
    } catch (error) {
      console.error("Failed to submit interest", error);
      alert("Failed to submit interest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-sm shadow-md border-t-4 border-[var(--color-academia-gold)]">
      <h3 className="text-lg font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 flex items-center gap-2">
        <FiCpu className="text-[var(--color-academia-gold)]" /> Real World Project Interest
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            What kind of real-world projects are you interested in?
          </label>
          <textarea
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="e.g. Building a scalable microservices architecture for e-commerce..."
            rows="3"
            className="w-full border-stone-300 rounded-sm focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)] p-3"
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[var(--color-academia-charcoal)] text-white px-4 py-2 rounded-sm hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? "Submitting..." : <><FiSend /> Submit Interest</>}
        </button>
      </form>

      {submittedInterests.length > 0 && (
        <div className="mt-6 border-t border-stone-100 pt-4">
          <h4 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
            <FiList /> Your Interests
          </h4>
          <ul className="space-y-2">
            {submittedInterests.map((item) => (
              <li key={item.id} className="bg-stone-50 p-3 rounded-sm text-sm text-stone-700 border border-stone-200">
                {item.interest_area}
                <span className="block text-xs text-stone-400 mt-1">{new Date(item.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectInterestForm;
