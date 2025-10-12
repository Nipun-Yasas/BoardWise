'use client';

import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#060010]/90 border-b border-slate-200 dark:border-violet-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-violet-600 dark:via-purple-600 dark:to-fuchsia-600 bg-clip-text text-transparent">
              BoardWise
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-700 dark:text-violet-200 hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-700 dark:text-violet-200 hover:text-blue-600 dark:hover:text-violet-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate-700 dark:text-violet-200 hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Testimonials</a>
            
            <ThemeToggle />
            
            <Link href="/auth" className="text-slate-700 dark:text-violet-200 hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Sign In</Link>
            <Link href="/auth" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-violet-700 dark:hover:to-purple-700 transition-all hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-violet-500/50">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
