export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#060010] text-slate-300 dark:text-violet-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700 dark:border-violet-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white dark:text-violet-200 font-bold text-xl mb-4">BoardWise</h3>
            <p className="text-sm">
              Helping university students find their dream boarding place since 2024.
            </p>
          </div>
          <div>
            <h4 className="text-white dark:text-violet-200 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white dark:text-violet-200 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white dark:text-violet-200 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-violet-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 dark:border-violet-900/30 pt-8 text-center text-sm">
          <p>&copy; 2024 BoardWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
