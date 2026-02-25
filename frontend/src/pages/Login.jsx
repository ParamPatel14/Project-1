import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import ConnectingNodes from "../components/ConnectingNodes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
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
              Welcome <br />
              <span className="text-[var(--color-academia-gold)]">Back</span>
            </h1>
            <p className="text-stone-600 text-lg">
              Sign in to continue your research journey.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-sm">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="you@example.com"
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[var(--color-academia-gold)] text-white py-4 rounded-sm font-bold tracking-wide shadow-md hover:bg-[var(--color-academia-gold-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-academia-gold)] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--color-academia-cream)] text-stone-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-stone-200 rounded-sm shadow-sm bg-white text-sm font-medium text-[var(--color-academia-charcoal)] hover:bg-stone-50 transition-colors"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </button>

              <button
                onClick={handleGithubLogin}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-stone-200 rounded-sm shadow-sm bg-white text-sm font-medium text-[var(--color-academia-charcoal)] hover:bg-stone-50 transition-colors"
              >
                <FaGithub className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-stone-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[var(--color-academia-charcoal)] hover:text-[var(--color-academia-gold)] transition-colors">
              Sign up
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

export default Login;
