import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // profile icon

const DashboardNavbar = ({ role }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load logged user
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  // Menu items by role
  const menuItems = {
    agent: [
      { name: "Dashboard", link: "/agent/dashboard" },
      { name: "My Listings", link: "/agent/listings" },
      { name: "Add Property", link: "/agent/add-property" },
      { name: "Analytics", link: "/agent/analytics" },
    ],
    buyer: [
      { name: "Dashboard", link: "/buyer/dashboard" },
      { name: "Browse Properties", link: "/buyer/properties" },
      { name: "Saved Listings", link: "/buyer/saved" },
      { name: "Contact Agents", link: "/buyer/agents" },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  // Close dropdown when clicking outside
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
    <header className="font-sans bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-emerald-500">
          PropertyPro
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 text-sm font-medium">
          {menuItems[role]?.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.link}
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <User className="w-6 h-6 text-white" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-3 z-50">
              <div className="px-4 py-2 border-b border-gray-700 space-y-1">
                <div className="flex gap-1 items-center">
                  <span className="font-semibold text-white text-sm">Username:</span>
                  <span
                    className="text-gray-400 text-sm truncate"
                    title={user?.name || "Guest"}
                  >
                    {user?.name || "Guest"}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-semibold text-white text-sm">Email:</span>
                  <span
                    className="text-gray-400 text-sm truncate"
                    title={user?.email || "-"}
                  >
                    {user?.email || "-"}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-semibold text-emerald-400 text-sm">Role:</span>
                  <span className="text-gray-400 text-sm">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;