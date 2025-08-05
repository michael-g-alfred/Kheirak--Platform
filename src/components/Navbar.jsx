import { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Logo from "../assets/logo.svg";
import CloseIcon from "../icons/CloseIcon";
import MenuIcon from "../icons/MenuIcon";
import NotificationBadge from "./NotificationBadge";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const Navbar = () => {
  const { role, logout, loading, currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser?.uid) {
        const userRef = doc(db, "Users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().userName);
        }
      }
    };

    fetchUserName();
  }, [currentUser]);

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
    {
      id: `beneficiary-profile/${userName}`,
      label: "الملف الشخصي",
    },
    {
      id: "notifications",
      label: <NotificationBadge />,
    },
    ...baseTabs,
    { id: "logout", label: "تسجيل الخروج" },
  ];

  const donorTabs = [
    {
      id: `donor-profile/${userName}`,
      label: "الملف الشخصي",
    },
    {
      id: "notifications",
      label: <NotificationBadge />,
    },
    ...baseTabs,
    { id: "logout", label: "تسجيل الخروج" },
  ];

  const orgTabs = [
    {
      id: `org-profile/${userName}`,
      label: "الملف الشخصي",
    },
    {
      id: "notifications",
      label: <NotificationBadge />,
    },
    ...baseTabs,
    { id: "logout", label: "تسجيل الخروج" },
  ];

  const adminTabs = [
    { id: "dashboard", label: "لوحة التحكم" },
    ...baseTabs,
    { id: "logout", label: "تسجيل الخروج" },
  ];

  const tabs = useMemo(() => {
    switch (role) {
      case "مشرف":
        return adminTabs;
      case "مستفيد":
        return beneficiaryTabs;
      case "متبرع":
        return donorTabs;
      case "مؤسسة":
        return orgTabs;
      default:
        return guestTabs;
    }
  }, [role, userName]);

  if (loading || role === null) return null;

  return (
    <nav
      dir="rtl"
      className="shadow-md border-b border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] fixed top-0 right-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Tabs */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center space-x-2">
              {tabs.map((tab) =>
                tab.id === "logout" ? (
                  <span
                    key={tab.id}
                    onClick={async () => {
                      await logout();
                      navigate("/");
                    }}
                    className="cursor-pointer p-2 text-sm md:text-md font-medium transition-colors duration-200 rounded-sm danger">
                    {tab.label}
                  </span>
                ) : (
                  <NavLink
                    key={tab.id}
                    to={tab.id === "home" ? "/" : `/${tab.id}`}
                    className={({ isActive }) =>
                      `className="cursor-pointer p-2 text-sm md:text-md transition-colors duration-200 rounded-sm ${
                        tab.id === "login"
                          ? "text-[var(--color-primary-base)] hover:text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                          : isActive
                          ? "font-bold bg-[var(--color-primary-base)] text-[var(--color-secondary-base)]"
                          : "font-medium text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
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
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          {/* Logo */}
          <NavLink
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer">
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
                  to={
                    tab.id === "home" || tab.id === "logout"
                      ? "/"
                      : `/${tab.id}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block p-2 text-base w-full text-left transition-colors duration-200 rounded-sm ${
                      tab.id === "login"
                        ? "text-[var(--color-primary-base)] hover:text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                        : isActive
                        ? "font-bold bg-[var(--color-primary-base)] text-[var(--color-secondary-base)]"
                        : "font-medium text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)]"
                    }`
                  }>
                  {tab.label}
                </NavLink>
              ))}
            {tabs.find((tab) => tab.id === "logout") && (
              <>
                <span
                  key="logout"
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                    navigate("/");
                  }}
                  className="block p-2 text-base font-medium w-full text-left cursor-pointer transition-colors duration-200 rounded-sm danger mt-2">
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
