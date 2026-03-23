import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, PlusCircle, User, X } from "lucide-react";
import { formatRoleLabel, getLoggedUser, isAgent, normalizeRole } from "../utils/auth";
import ThemeToggle from "./ThemeToggle";

const DashboardNavbar = () => {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
    <header className="navbar-shell sticky top-0 z-50 border-b text-white backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="headline-font flex items-center gap-3 text-white">
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
              <Link to={item.link} className="text-slate-200 transition-colors duration-200 hover:text-white">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {agent && (
            <Link to="/add-property" className="primary-button px-4 py-3 text-sm">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </Link>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="nav-pill-button flex items-center gap-3 rounded-full px-2 py-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                <User className="h-5 w-5" />
              </span>
              <span className="pr-3 text-left">
                <span className="block text-sm font-semibold text-white">{user?.name || "Guest"}</span>
                <span className="block text-xs text-slate-400">{formatRoleLabel(user?.role)}</span>
              </span>
            </button>

            {open && (
              <div className="menu-surface absolute right-0 mt-3 w-72 rounded-3xl p-4 shadow-2xl shadow-black/30">
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
                  className="danger-button mt-4 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="nav-icon-button flex h-11 w-11 items-center justify-center rounded-2xl lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle dashboard menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="menu-surface mx-4 mb-4 rounded-3xl p-4 shadow-2xl shadow-black/20 lg:hidden">
          <div className="space-y-2">
            {menuItems[normalizedRole]?.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                {item.name}
              </Link>
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
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
