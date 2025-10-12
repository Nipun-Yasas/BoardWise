'use client';

import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

export default function AuthContainer() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[700px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative h-full flex">
          {/* Forms Container - switches sides */}
          <div
            className={`absolute h-full w-1/2 transition-all duration-700 ease-in-out ${
              isSignup ? 'left-1/2' : 'left-0'
            }`}
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Login Form */}
              <div
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isSignup
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                <Login onSwitchToSignup={() => setIsSignup(true)} />
              </div>

              {/* Signup Form */}
              <div
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isSignup
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <Signup onSwitchToLogin={() => setIsSignup(false)} />
              </div>
            </div>
          </div>

          {/* Panels Container - switches sides */}
          <div
            className={`absolute h-full w-1/2 transition-all duration-700 ease-in-out ${
              isSignup ? 'left-0' : 'left-1/2'
            }`}
          >
            <div className="relative w-full h-full">
              {/* Signup Panel (shows when login is active - right side) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 transition-all duration-700 ease-in-out ${
                  isSignup
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                <div className="h-full flex items-center justify-center p-12 text-white">
                  <div className="text-center space-y-6 animate-fadeIn">
                    <h2 className="text-4xl font-bold">Hello, Friend!</h2>
                    <p className="text-lg opacity-90">
                      Enter your personal details and start your journey with us
                    </p>
                    <button
                      onClick={() => setIsSignup(true)}
                      className="mt-8 px-8 py-3 border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Panel (shows when signup is active - left side) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 transition-all duration-700 ease-in-out ${
                  isSignup
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="h-full flex items-center justify-center p-12 text-white">
                  <div className="text-center space-y-6 animate-fadeIn">
                    <h2 className="text-4xl font-bold">Welcome Back!</h2>
                    <p className="text-lg opacity-90">
                      To keep connected with us please login with your personal info
                    </p>
                    <button
                      onClick={() => setIsSignup(false)}
                      className="mt-8 px-8 py-3 border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
