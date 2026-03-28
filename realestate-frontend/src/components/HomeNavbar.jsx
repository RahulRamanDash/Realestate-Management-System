import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import ThemeToggle from "./ThemeToggle";

function HomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Properties", to: "/properties" },
    { label: "Why Us", to: "/#why-us" },
    { label: "Get Started", to: "/userAuth?tab=register" },
  ];

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to.split("?")[0]);
  };

  const linkClasses = (to) => {
    const active = isActive(to);
    return `transition-all duration-200 font-medium relative ${
      active
        ? "text-emerald-300"
        : "text-slate-200 hover:text-white"
    }`;
  };

  return (
    <header className="navbar-shell sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="headline-font flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-lime-300 text-lg font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
            PP
          </span>
          <span>
            <span className="block text-xl font-bold leading-none text-white">PropertyPro</span>
            <span className="block text-xs uppercase tracking-[0.35em] text-emerald-200/80">
              Real Estate Hub
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className={linkClasses(item.to)}>
                {item.label}
                {isActive(item.to) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-300 to-lime-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link to="/userAuth" className="primary-button px-5 py-3 text-sm">
            Login / Register
          </Link>
        </div>

        <button
          className="nav-icon-button flex h-11 w-11 items-center justify-center rounded-2xl lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="menu-surface mx-4 mb-4 rounded-3xl p-4 shadow-2xl lg:hidden overflow-hidden"
          >
            <div className="space-y-2 text-sm font-semibold text-slate-200">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 transition ${
                      isActive(item.to)
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
              <Link
                to="/userAuth"
                onClick={() => setMenuOpen(false)}
                className="primary-button mt-3 flex w-full justify-center"
              >
                Login / Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default HomeNavbar;
