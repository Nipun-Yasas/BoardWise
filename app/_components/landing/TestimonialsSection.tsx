export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      university: 'University of Colombo',
      content: 'BoardWise made finding my boarding place so easy! The verified listings gave me peace of mind.',
    },
    {
      name: 'Ashan Silva',
      university: 'University of Moratuwa',
      content: 'The best platform for students. Found my perfect place within a week with transparent pricing.',
    },
    {
      name: 'Priya Patel',
      university: 'University of Peradeniya',
      content: 'Real photos and honest reviews helped me make the right choice. Highly recommended!',
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#060010]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Students Say
          </h2>
          <p className="text-xl text-slate-600 dark:text-violet-200 max-w-2xl mx-auto">
            Don't just take our word for it - hear from students who found their perfect place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white dark:bg-violet-950/30 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 dark:border-violet-900/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-700 dark:text-violet-200 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-violet-600 dark:to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-slate-600 dark:text-violet-300 text-sm">{testimonial.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
