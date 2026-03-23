import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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

  const linkClasses = (to) =>
    `transition-colors duration-200 ${
      location.pathname === to ? "text-emerald-300" : "text-slate-200 hover:text-white"
    }`;

  return (
    <header className="navbar-shell sticky top-0 z-50 border-b backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="headline-font flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-lime-300 text-lg font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
            PP
          </span>
          <span>
            <span className="block text-xl font-bold leading-none">PropertyPro</span>
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
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="menu-surface mx-4 mb-4 rounded-3xl p-4 shadow-2xl lg:hidden">
          <div className="space-y-2 text-sm font-semibold text-slate-200">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <ThemeToggle />
            </div>
            <Link
              to="/userAuth"
              onClick={() => setMenuOpen(false)}
              className="primary-button mt-3 flex w-full"
            >
              Login / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;
