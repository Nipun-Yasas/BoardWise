'use client';

import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { Boxy, Roundy, Spiky } from './Characters';

export default function AuthContainer() {
  const [isSignup, setIsSignup] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 flex flex-col lg:flex-row relative">
      {/* Form Container - Scrolls with page */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white dark:bg-neutral-950 transition-transform duration-700 ease-in-out z-10 ${isSignup ? 'lg:translate-x-full' : 'lg:translate-x-0'
          }`}
      >
        <div className="w-full max-w-md my-auto">
          {/* We use opacity/display to swap forms smoothly */}
          <div className={`${isSignup ? 'block animate-fadeIn' : 'hidden'}`}>
            <Register onSwitchToLogin={() => setIsSignup(false)} />
          </div>
          <div className={`${!isSignup ? 'block animate-fadeIn' : 'hidden'}`}>
            <Login onSwitchToSignup={() => setIsSignup(true)} />
          </div>
        </div>
      </div>

      {/* Character/Overlay Container - Sticky */}
      <div
        className={`hidden lg:flex w-1/2 sticky top-0 h-screen bg-slate-50 dark:bg-neutral-900 items-center justify-center overflow-hidden flex-col transition-transform duration-700 ease-in-out z-20 ${isSignup ? 'lg:-translate-x-full' : 'lg:translate-x-0'
          }`}
      >
        {/* Background Grid/Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Watching Characters */}
        <div className="relative z-10 flex gap-12 items-end pb-12">
          <Boxy mouseX={mousePos.x} mouseY={mousePos.y} />
          <Roundy mouseX={mousePos.x} mouseY={mousePos.y} />
          <Spiky mouseX={mousePos.x} mouseY={mousePos.y} />
        </div>

        <div className="relative z-10 text-center mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSignup ? "Already one of us?" : "New here?"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm px-8">
            {isSignup
              ? "If you already have an account, just sign in. We've missed you!"
              : "Register and discover a great amount of new opportunities!"}
          </p>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="px-8 py-3 rounded-xl border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all duration-300"
          >
            {isSignup ? "Sign In" : "Register"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
