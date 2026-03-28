import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, PlusCircle, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { clearSession, formatRoleLabel, getLoggedUser, isAgent, normalizeRole } from "../utils/auth";
import ThemeToggle from "./ThemeToggle";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = getLoggedUser();
  const agent = isAgent(user);
  const normalizedRole = normalizeRole(user?.role);

  const menuItems = {
    ROLE_AGENT: [
      { name: "Dashboard", link: "/dashboard" },
      { name: "My Listings", link: "/my-listings" },
      { name: "Browse Properties", link: "/properties" },
    ],
    ROLE_BUYER: [
      { name: "Dashboard", link: "/dashboard" },
      { name: "Browse Properties", link: "/properties" },
      { name: "Owned Properties", link: "/owned-properties" },
    ],
    ROLE_ADMIN: [
      { name: "Dashboard", link: "/dashboard" },
      { name: "Browse Properties", link: "/properties" },
    ],
  };

  const isActive = (link) => location.pathname === link;

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar-shell sticky top-0 z-50 border-b border-white/10 text-white backdrop-blur-xl bg-black/40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="headline-font flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-lime-300 text-lg font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
            PP
          </span>
          <div>
            <span className="block text-lg font-bold leading-none">PropertyPro</span>
            <span className="block text-xs uppercase tracking-[0.28em] text-emerald-200/80">
              {agent ? "Agent Studio" : "Buyer Dashboard"}
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {menuItems[normalizedRole]?.map((item) => (
            <li key={item.link}>
              <Link
                to={item.link}
                className="transition-all duration-200 relative group"
              >
                <span className={isActive(item.link) ? "text-emerald-300" : "text-slate-200 group-hover:text-white"}>
                  {item.name}
                </span>
                {isActive(item.link) && (
                  <motion.div
                    layoutId="activeNav"
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
          {agent && (
            <Link to="/add-property" className="primary-button px-4 py-3 text-sm flex items-center gap-2 hover:scale-105 transition-transform">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Link>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="nav-pill-button flex items-center gap-3 rounded-full px-2 py-2 hover:bg-white/10 transition-colors"
              aria-expanded={open}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                <User className="h-5 w-5" />
              </span>
              <span className="pr-3 text-left">
                <span className="block text-sm font-semibold text-white">{user?.name || "Guest"}</span>
                <span className="block text-xs text-slate-400">{formatRoleLabel(user?.role)}</span>
              </span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="menu-surface absolute right-0 mt-3 w-72 rounded-3xl p-4 shadow-2xl shadow-black/30"
                >
                  <div className="space-y-1 border-b border-white/10 pb-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/75">Profile</p>
                    <div className="soft-surface grid grid-cols-2 gap-4 rounded-[1.25rem] p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Name</p>
                        <p className="mt-1 text-lg font-bold text-white">{user?.name || "Guest"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Role</p>
                        <p className="mt-1 text-sm text-emerald-200">{formatRoleLabel(user?.role)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
                        <p className="mt-1 truncate text-sm text-slate-300">{user?.email || "-"}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="danger-button mt-4 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="nav-icon-button flex h-11 w-11 items-center justify-center rounded-2xl lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle dashboard menu"
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
            className="menu-surface mx-4 mb-4 rounded-3xl p-4 shadow-2xl shadow-black/20 lg:hidden overflow-hidden"
          >
            <div className="space-y-2">
              {menuItems[normalizedRole]?.map((item, index) => (
                <motion.div
                  key={item.link}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.link}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive(item.link)
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "text-slate-200 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className="danger-button mt-3 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardNavbar;
