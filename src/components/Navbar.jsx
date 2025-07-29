import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Logo from "../assets/logo.svg";
import CloseIcon from "../icons/CloseIcon";
import MenuIcon from "../icons/MenuIcon";

const Navbar = () => {
  const {
    currentUser,
    userData,
    isAuthenticated,
    role,
    logout,
    loading,
    username,
  } = useAuth();
  // const { currentUser, userData, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { user, isAuthenticated, logout } = useAuth();

  const baseTabs = [
    { id: "home", label: "الرئيسية" },
    { id: "about", label: "من نحن" },
    { id: "services", label: "الخدمات" },
    { id: "portfolio", label: "أعمالنا" },
    { id: "contact", label: "تواصل معنا" },
  ];

  const guestTabs = [
    ...baseTabs,
    { id: "registration", label: "تسجيل الدخول" },
  ];

  const beneficiaryTabs = [
    ...baseTabs,
    { id: "logout", label: "تسجيل الخروج" },
  ];

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

  // let tabs = guestTabs;
  // note: condition to check if user is logged in and has a role
  let tabs = guestTabs;

  if (isAuthenticated) {
    switch (role) {
      case "admin":
        tabs = adminTabs;
        console.log("admin");
        break;
      case "beneficiary":
        tabs = beneficiaryTabs;
        console.log("needy");
        break;
      case "donor":
        tabs = donorTabs;
        console.log("donor");
        break;
      case "organization":
        tabs = orgTabs;
        console.log("org");
        break;
      default:
        tabs = guestTabs;
    }
  }

  // if (currentUser && userData?.role) {
  //   switch (userData.role) {
  //     case "admin":
  //       tabs = adminTabs;
  //       break;
  //     case "beneficiary":
  //     case "needy":
  //       tabs = beneficiaryTabs;
  //       break;
  //     case "donor":
  //       tabs = donorTabs;
  //       break;
  //     case "organization":
  //       tabs = orgTabs;
  //       break;
  //     default:
  //       tabs = guestTabs;
  //   }
  // }

  return (
    <nav
      dir="rtl"
      className="shadow-md border-b border-[var(--color-bg-divider)]"
    >
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
                    className="cursor-pointer px-2 py-2 text-sm font-medium transition-colors duration-200 rounded-sm bg-[var(--color-danger-dark)] text-[var(--color-bg-text)] hover:bg-[var(--color-danger-dark-plus)]"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-danger-dark-plus)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-danger-dark)")
                    }
                  >
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
                    }
                  >
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          {/* Logo */}
          <NavLink
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-12 w-12 transition-transform duration-200 hover:scale-110 cursor-pointer"
            />
          </NavLink>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-bg-base)]">
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
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            {tabs.find((tab) => tab.id === "logout") && (
              <>
                <hr className="mt-8 border-t border-[var(--color-bg-divider)] rounded-full" />
                <span
                  key="logout"
                  // onClick={() => {
                  //   setIsMenuOpen(false);
                  // }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="block px-2 py-2 text-base font-medium w-full text-left cursor-pointer transition-colors duration-200 rounded-sm bg-[var(--color-danger-dark)] text-[var(--color-bg-text)] hover:bg-[var(--color-danger-dark-plus)] mt-2"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-danger-dark-plus)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-danger-dark)")
                  }
                >
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
