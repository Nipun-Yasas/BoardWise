export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Find Your Perfect Place?
        </h2>
        <p className="text-xl text-blue-100 dark:text-violet-100 mb-8">
          Join thousands of students who have already found their ideal boarding
          place
        </p>
        <button className="px-8 py-4 bg-white text-blue-600 dark:text-violet-600 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-violet-50 transition-all hover:shadow-2xl hover:shadow-white/50 hover:scale-105">
          Start Your Search Now →
        </button>
      </div>
    </section>
  );
}
