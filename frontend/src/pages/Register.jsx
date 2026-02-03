import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiBook } from "react-icons/fi";
import { motion } from "framer-motion";
import ConnectingNodes from "../components/ConnectingNodes";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(email, password, name, role);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-academia-cream)]">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-academia-charcoal)] mb-4 leading-tight">
              Identify Your <br />
              <span className="text-[var(--color-academia-gold)]">Academic Path</span>
            </h1>
            <p className="text-stone-600 text-lg">
              Join a network of scholars and mentors. Align your skills with research opportunities that matter.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-sm">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-academia-charcoal)] mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)] transition-colors shadow-sm"
                  placeholder="Jane Scholar"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-academia-charcoal)] mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)] transition-colors shadow-sm"
                  placeholder="scholar@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-academia-charcoal)] mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-academia-gold)] focus:border-[var(--color-academia-gold)] transition-colors shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-academia-charcoal)] mb-2 uppercase tracking-wide">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-sm transition-all ${
                    role === "student"
                      ? "bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] border-[var(--color-academia-charcoal)] shadow-md"
                      : "bg-white text-stone-500 border-stone-200 hover:border-[var(--color-academia-gold)]"
                  }`}
                >
                  <FiBook /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("mentor")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-sm transition-all ${
                    role === "mentor"
                      ? "bg-[var(--color-academia-charcoal)] text-[var(--color-academia-cream)] border-[var(--color-academia-charcoal)] shadow-md"
                      : "bg-white text-stone-500 border-stone-200 hover:border-[var(--color-academia-gold)]"
                  }`}
                >
                  <FiUser /> Mentor
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[var(--color-academia-gold)] text-white py-4 rounded-sm font-bold tracking-wide shadow-md hover:bg-[var(--color-academia-gold-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-academia-gold)] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Initialize Profile'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - 3D Visual */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <ConnectingNodes />
        <div className="absolute inset-0 bg-[var(--color-academia-charcoal)] opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Register;
