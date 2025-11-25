"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Services", id: "services" },
    { label: "Projects", id: "projects" },
    { label: "Process", id: "process" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <button
              onClick={() => scrollToSection("hero")}
              className={`text-xl font-light tracking-tight transition-colors ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              Tech Job
            </button>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-light transition-opacity hover:opacity-70 ${
                    scrolled ? "text-black" : "text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* LOGIN BUTTON (DESKTOP) */}
            <Link href="/auth/login" passHref legacyBehavior>
              <Button
                variant="outline"
                // *** แก้ไข className ตรงนี้ ***
                className={`hidden md:block border rounded-full px-6 py-2 text-sm font-light transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${
                  scrolled
                    ? "border-black text-black hover:bg-black hover:text-white"
                    : "border-white text-black hover:bg-white hover:text-black"
                }`}
              >
                Login
              </Button>
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white/98 backdrop-blur-xl shadow-lg md:hidden overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left text-lg font-light text-black hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </motion.button>
              ))}

              <Button
                variant="outline"
                className="w-full border-black text-black hover:bg-black hover:text-white rounded-full py-6 text-base font-light"
              >
                Login
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
