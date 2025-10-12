export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Search & Filter',
      description: 'Use our smart search to find boarding places that match your preferences and budget.',
    },
    {
      number: '2',
      title: 'Compare & Review',
      description: 'Browse photos, read reviews, and compare different options to find your perfect match.',
    },
    {
      number: '3',
      title: 'Book & Move In',
      description: 'Complete your booking securely and get ready to move into your new home!',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0a0020]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-violet-200 max-w-2xl mx-auto">
            Finding your perfect boarding place is just three simple steps away
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="bg-white dark:bg-violet-950/30 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 dark:border-violet-900/50">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-blue-500/50 dark:shadow-violet-500/50">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-violet-200">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
