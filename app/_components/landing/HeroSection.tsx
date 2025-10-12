'use client';

import CountUp from './CountUp';
import Plasma from './Plasma';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
      {/* Plasma Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Plasma 
          color="#4f46e5"
          speed={0.5}
          direction="forward"
          scale={1.0}
          opacity={0.25}
          mouseInteractive={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-2 bg-blue-100 dark:bg-violet-900/30 text-blue-700 dark:text-violet-400 rounded-full text-sm font-semibold border border-blue-200 dark:border-violet-800">
              🎓 For University Students
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
            Find Your Dream
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-violet-600 dark:via-purple-600 dark:to-fuchsia-600 bg-clip-text text-transparent">
              Boarding Place
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-violet-200 max-w-2xl mx-auto">
            Discover the perfect home away from home. Browse verified boarding places near your university with ease.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
            {[
              { number: 500, label: 'Verified Places', suffix: '+' },
              { number: 2000, label: 'Happy Students', suffix: '+' },
              { number: 50, label: 'Universities', suffix: '+' },
              { number: 4.8, label: 'Average Rating', suffix: '★' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-violet-400">
                  <CountUp
                    from={0}
                    to={stat.number}
                    separator=","
                    direction="up"
                    duration={2}
                    className="inline-block"
                  />
                  {stat.suffix}
                </div>
                <div className="text-slate-600 dark:text-violet-300 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
