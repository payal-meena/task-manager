import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if(!name || !email || !password ) return "All fields required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) return "Invalid email format";

    if(password.length < 6) return "Password must be at least 6+ characters";

    return null;
  };

  const handleSignup = async () => {
    const validationError = validate();
    if (validationError ) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/api/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
          <p className="text-slate-400 mt-1">Create your account to get started.</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium transition">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
