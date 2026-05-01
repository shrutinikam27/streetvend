import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email.');
        setEmail('');
      } else {
        setError(data.message || data.errors?.[0]?.msg || 'Failed to process request.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 relative overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans">
      <style>
        {`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes floatIcon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-entrance {
            animation: fadeSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-float-icon {
            animation: floatIcon 4s ease-in-out infinite;
          }
          .animate-pulse-glow {
            animation: pulseGlow 6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Deeply Animated Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-orange-300/40 rounded-none mix-blend-multiply filter blur-[80px] animate-[spin_20s_linear_infinite] origin-bottom-right rotate-45"></div>
        <div className="absolute top-[30%] right-[-20%] w-[50vw] h-[50vw] bg-yellow-300/40 rounded-none mix-blend-multiply filter blur-[80px] animate-[spin_25s_linear_infinite_reverse] origin-top-left rotate-12"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[55vw] h-[55vw] bg-red-300/30 rounded-none mix-blend-multiply filter blur-[80px] animate-pulse-glow -rotate-12"></div>
      </div>

      {/* Animated Horizontal Form Container */}
      <div className="w-full max-w-4xl relative z-10 animate-entrance opacity-0">
        <div className="bg-white/60 backdrop-blur-3xl border-2 border-white/80 rounded-none shadow-[15px_15px_0px_0px_rgba(249,115,22,0.2)] overflow-hidden relative group flex flex-col md:flex-row">
          
          {/* Interactive Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

          {/* Left Side: Branding / Icon */}
          <div className="md:w-5/12 bg-orange-500/10 p-10 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-white/80 relative z-10">
            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-orange-400 to-orange-600 rounded-none flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(249,115,22,0.4)] animate-float-icon">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="mt-10 text-4xl font-black text-gray-900 tracking-tight uppercase text-center leading-tight">
              Reset<br/>Password
            </h2>
            <div className="w-12 h-1 bg-orange-500 mt-6 mb-4"></div>
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wider text-center">
              Account Recovery
            </p>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-7/12 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
            
            {error && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 font-bold uppercase text-xs tracking-wider" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {message && (
              <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 font-bold uppercase text-xs tracking-wider" role="alert">
                <p>{message}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <p className="text-gray-600 text-sm font-semibold mb-4">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <div className="group/input relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within/input:scale-110">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within/input:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-white/70 border-2 border-white rounded-none text-gray-900 placeholder-gray-500 font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(249,115,22,0.1)]"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative mt-8 w-full flex justify-center py-4 px-4 border-2 border-transparent text-sm font-black uppercase tracking-widest rounded-none text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(249,115,22,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(249,115,22,0.5)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!loading && <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>}
                <span className="relative">{loading ? 'Sending...' : 'Send Reset Link'}</span>
              </button>

              <p className="text-center text-xs font-bold uppercase tracking-wide text-gray-600 mt-8">
                Remember your password?{' '}
                <Link to="/login" className="font-black text-orange-600 hover:text-orange-500 transition-colors underline decoration-2 underline-offset-4">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
