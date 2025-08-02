import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index";

const Home = lazy(() => import("../pages/Home"));
const Posts = lazy(() => import("../pages/Posts"));
const Coupons = lazy(() => import("../pages/Coupons"));
import About from "../pages/About";
import Services from "../pages/Services";
import Portfolio from "../pages/Portfolio";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Registration from "../pages/Registration";
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const DonorProfile = lazy(() => import("../pages/DonorProfile"));
const OrgProfile = lazy(() => import("../pages/OrgProfile"));
const BeneficiaryProfile = lazy(() => import("../pages/BeneficiaryProfile"));
const Notifications = lazy(() => import("../pages/Notifications"));
import LogoIcon from "../icons/LogoIcon";

function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center text-[var(--color-bg-text)] text-lg">
            <LogoIcon />
          </div>
        </div>
      }>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="posts" element={<Posts />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />

        {/* Guest */}
        <Route path="/registration" element={<Registration />} />

        {/* Admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["مشرف"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Beneficiary */}
        <Route
          path="/beneficiary-profile/:email?"
          element={
            <ProtectedRoute allowedRoles={["مستفيد"]}>
              <BeneficiaryProfile />
            </ProtectedRoute>
          }
        />

        {/* Donor */}
        <Route
          path="/donor-profile/:email?"
          element={
            <ProtectedRoute allowedRoles={["متبرع"]}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />

        {/* Org */}
        <Route
          path="/org-profile/:email?"
          element={
            <ProtectedRoute allowedRoles={["مؤسسة"]}>
              <OrgProfile />
            </ProtectedRoute>
          }
        />

        {/* Beneficiary || Donor || Org */}
        <Route
          path="/notifications/:email?"
          element={
            <ProtectedRoute allowedRoles={["متبرع", "مؤسسة", "مستفيد"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route path="/logout" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
