import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Logo from "../assets/logo.svg";
import CloseIcon from "../icons/CloseIcon";
import MenuIcon from "../icons/MenuIcon";
import NotificationBadge from "./NotificationBadge";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import UserProfileTab from "./UserProfileTab";

const NavLinksList = ({ tabs, isMobile, onClick }) => (
  <>
    {tabs.map((tab) => (
      <NavLink
        key={tab.id}
        to={tab.id === "home" ? "/" : `/${tab.id}`}
        onClick={onClick}
        className={({ isActive }) =>
          `${
            isMobile
              ? "block p-2 text-base w-full"
              : "cursor-pointer p-2 text-sm md:text-md"
          } transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)] ${
            tab.id === "registration"
              ? isActive
                ? "text-[var(--color-bg-text)] bg-[var(--color-primary-base)] font-bold"
                : "border border-[var(--color-primary-base)] text-[var(--color-primary-base)] hover:text-[var(--color-bg-text)] hover:bg-[var(--color-primary-base)]"
              : isActive
              ? "font-bold bg-[var(--color-primary-base)] text-[var(--color-bg-text)]"
              : "font-medium text-[var(--color-primary-base)] hover:bg-[var(--color-primary-base)] hover:text-[var(--color-bg-text)]"
          }`
        }>
        {tab.label}
      </NavLink>
    ))}
  </>
);

const Navbar = () => {
  const { role, loading, currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userName, setUserName] = useState(null);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL);

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser?.uid) {
        try {
          const userRef = doc(db, "Users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserName(userSnap.data().userName);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      } else {
        setUserName(null);
      }
    };

    fetchUserName();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser?.photoURL]);

  const baseTabs = [
    { id: "home", label: "الرئيسية" },
    { id: "about", label: "من نحن" },
    { id: "services", label: "الخدمات" },
    { id: "portfolio", label: "أعمالنا" },
    { id: "contact", label: "تواصل معنا" },
  ];

  const guestTabs = [
    ...baseTabs,
    {
      id: "registration",
      label: "تسجيل الدخول",
    },
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "لوحة التحكم" },
    { id: "admin-messages", label: "الرسائل" },
    ...baseTabs,
  ];

  const tabs = useMemo(() => {
    const beneficiaryTabsWithUser = [
      UserProfileTab({
        pathPrefix: "beneficiary",
        userName,
        photoURL,
      }),
      {
        id: "notifications",
        label: <NotificationBadge />,
      },
      ...baseTabs,
    ];

    const donorTabsWithUser = [
      UserProfileTab({
        pathPrefix: "donor",
        userName,
        photoURL,
      }),
      {
        id: "notifications",
        label: <NotificationBadge />,
      },
      ...baseTabs,
    ];

    const orgTabsWithUser = [
      UserProfileTab({
        pathPrefix: "org",
        userName,
        photoURL,
      }),
      {
        id: "notifications",
        label: <NotificationBadge />,
      },
      ...baseTabs,
    ];

    switch (role) {
      case "مشرف":
        return adminTabs;
      case "مستفيد":
        return beneficiaryTabsWithUser;
      case "متبرع":
        return donorTabsWithUser;
      case "مؤسسة":
        return orgTabsWithUser;
      default:
        return guestTabs;
    }
  }, [role, userName, photoURL]);

  if (loading || role === null) return null;

  return (
    <nav
      dir="rtl"
      className="shadow-xs border-b border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] fixed top-0 right-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Tabs */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center space-x-2">
              <NavLinksList tabs={tabs} isMobile={false} />
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="text-[var(--color-primary-base)] hover:text-[var(--color-primary-hover)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          {/* Logo */}
          <NavLink
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)] rounded-lg">
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-bg-base)] text-right">
            <NavLinksList
              tabs={tabs}
              isMobile={true}
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
