"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./Button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter(); // Initialize router
  const { scrollY } = useScroll();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640) setMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="pointer-events-none fixed justify-center top-0 left-0 right-0 h-6 bg-gradient-to-b from-[var(--background)] to-transparent z-40"
      />
      <header className="pointer-events-none fixed top-0 left-0 right-0 z-[999] w-full px-0 py-4 flex justify-center">
        <motion.nav
          layout
          initial={{
            width: "800px",
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          animate={
            isMobile
              ? { backgroundColor: "rgba(0, 0, 0, 0)", width: "95%" }
              : {
                width: isScrolled ? "fit-content" : "1000px",
                backgroundColor: isScrolled
                  ? "var(--background-secondary)"
                  : "rgba(0, 0, 0, 0)",
              }
          }
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="relative max-screen bg-solid sm:backdrop-blur-md  pointer-events-auto flex w-full items-center justify-between gap-6 rounded-full px-4 py-1 transition-colors sm:px-6 sm:pr-4"
        >
          <Link
            className="font-clash-display text-xl text-textPrimary font-medium sm:text-xl"
            href="/"
          >
            BoardWise
          </Link>
          <ul className="hidden font-light gap-6 text-sm sm:flex whitespace-nowrap px-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li
                  key={item.name}
                  className="group relative flex items-center"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -left-3 h-1.5 w-1.5 rounded-full bg-primary"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <a
                    className={`text-textPrimary ${isActive ? "font-semibold" : ""
                      }`}
                    href={item.href}
                  >
                    <span className="relative inline-flex overflow-hidden">
                      <div className="translate-y-0 skew-y-0 transform-gpu transition-transform duration-500 group-hover:-translate-y-[150%] group-hover:skew-y-12">
                        {item.name}
                      </div>
                      <div className="absolute translate-y-[150%] skew-y-12 transform-gpu transition-transform duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                        {item.name}
                      </div>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-center gap-4">
            <div className="hidden sm:flex gap-4">
              <button onClick={() => router.push('/auth')}>Login</button>
              <button onClick={() => router.push('/auth')}>Register</button>
            </div>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="sm:hidden p-2 text-textPrimary"
            >
              <Menu size={24} />
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-backgroundSecondary backdrop-blur-sm sm:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-64 bg-background border-l border-borderPrimary p-6 sm:hidden flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-clash-display text-xl font-medium text-textPrimary">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-textPrimary hover:bg-hoverPrimary rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-lg ${pathname === item.href
                        ? "text-primary font-semibold"
                        : "text-textPrimary"
                        }`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-4">
                <Button className="w-full">Login</Button>
                <Button className="w-full">Register</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
