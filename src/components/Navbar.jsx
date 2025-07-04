import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const baseTabs = [
    { id: "home", label: "الرئيسية" },
    { id: "about", label: "من نحن" },
    { id: "services", label: "الخدمات" },
    { id: "portfolio", label: "أعمالنا" },
    { id: "contact", label: "تواصل معنا" },
  ];

  const guestTabs = [{ id: "login", label: "تسجيل الدخول" }, ...baseTabs];

  const neededTabs = [...baseTabs, { id: "logout", label: "تسجيل الخروج" }];

  const donorTabs = [
    { id: "logout", label: "تسجيل الخروج" },
    { id: "profile", label: "الملف الشخصي" },
    ...baseTabs,
  ];

  const orgTabs = [
    { id: "logout", label: "تسجيل الخروج" },
    { id: "profile", label: "الملف الشخصي" },
    ...baseTabs,
  ];

  const adminTabs = [
    { id: "logout", label: "تسجيل الخروج" },
    { id: "dashboard", label: "لوحة التحكم" },
    ...baseTabs,
  ];

  let tabs = guestTabs;
  if (isAuthenticated) {
    if (user && user.type === "admin") {
      tabs = adminTabs;
    } else if (user && user.type === "donor") {
      tabs = donorTabs;
    } else if (user && user.type === "org") {
      tabs = orgTabs;
    }
  }

  return (
    <nav
      dir="rtl"
      className="shadow-md border-b"
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderColor: "var(--color-bg-divider)",
        borderBottomWidth: ".0625rem",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Tabs */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-1">
              {tabs.map((tab) =>
                tab.id === "logout" ? (
                  <span
                    key={tab.id}
                    onClick={logout}
                    className="cursor-pointer px-2 py-2 text-sm font-medium transition-colors duration-200 rounded-sm"
                    style={{
                      backgroundColor: "var(--color-danger-dark)",
                      color: "var(--color-bg-text)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-danger-dark-plus)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-danger-dark)")
                    }>
                    {tab.label}
                  </span>
                ) : (
                  <NavLink
                    key={tab.id}
                    to={tab.id === "home" ? "/" : `/${tab.id}`}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-sm ${
                        tab.id === "login"
                          ? "text-[var(--color-primary-base)] hover:text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                          : isActive
                          ? "bg-[var(--color-primary-base)] text-[var(--color-secondary-base)]"
                          : "text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                      }`
                    }>
                    {tab.label}
                  </NavLink>
                )
              )}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-[var(--color-bg-text)] hover:text-gray-300 focus:outline-none focus:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg
                className="h-6 w-6 transition duration-800 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          {/* Logo */}
          <NavLink
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer">
            <img
              src={Logo}
              alt="Logo"
              className="h-12 w-12 transition-transform duration-200 hover:scale-110"
              style={{ cursor: "pointer" }}
            />
          </NavLink>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            style={{ backgroundColor: "var(--color-bg-base)" }}>
            {tabs
              .filter((tab) => tab.id !== "logout")
              .map((tab) => (
                <NavLink
                  key={tab.id}
                  to={tab.id === "home" ? "/" : `/${tab.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-2 py-2 text-base font-medium w-full text-left transition-colors duration-200 rounded-sm ${
                      tab.id === "login"
                        ? "text-[var(--color-primary-base)] hover:text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                        : isActive
                        ? "bg-[var(--color-primary-base)] text-[var(--color-secondary-base)]"
                        : "text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                    }`
                  }>
                  {tab.label}
                </NavLink>
              ))}
            {tabs.find((tab) => tab.id === "logout") && (
              <>
                <hr className="mt-8 border-t border-[var(--color-bg-divider)] rounded-full" />
                <span
                  key="logout"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block px-2 py-2 text-base font-medium w-full text-left cursor-pointer transition-colors duration-200 rounded-sm"
                  style={{
                    marginTop: ".5rem",
                    backgroundColor: "var(--color-danger-dark)",
                    color: "var(--color-bg-text)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-danger-dark-plus)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-danger-dark)")
                  }>
                  {tabs.find((tab) => tab.id === "logout").label}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
