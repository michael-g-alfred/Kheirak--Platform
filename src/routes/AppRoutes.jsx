import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index";

import About from "../pages/About";
import Services from "../pages/Services";
import Portfolio from "../pages/Portfolio";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Registration from "../pages/Registration";
import ChooseRole from "../pages/ChooseRole";
import LogoIcon from "../icons/LogoIcon";
import AdminMessages from "../pages/AdminMessages";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
const Home = lazy(() => import("../pages/Home"));
const Posts = lazy(() => import("../pages/Posts"));
const Coupons = lazy(() => import("../pages/Coupons"));
const Campaigns = lazy(() => import("../pages/Campaigns"));
const Payment = lazy(() => import("../pages/Payment"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const BeneficiaryProfile = lazy(() => import("../pages/BeneficiaryProfile"));
const DonorProfile = lazy(() => import("../pages/DonorProfile"));
const OrgProfile = lazy(() => import("../pages/OrgProfile"));
const Notifications = lazy(() => import("../pages/Notifications"));

function ProtectedRoute({ children, allowedRoles }) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center text-[var(--color-bg-text)] text-lg">
          <LogoIcon />
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
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
      }
    >
      <Routes>
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/" element={<Home />}>
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="posts" element={<Posts />} />
          <Route path="coupons" element={<Coupons />} />
          <Route
            path="campaigns"
            element={
              <ProtectedRoute allowedRoles={["متبرع"]}>
                <Campaigns />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["متبرع"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />

        {/* Guest */}
        <Route path="/registration" element={<Registration />} />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["مشرف"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-messages"
          element={
            <ProtectedRoute allowedRoles={["مشرف"]}>
              <AdminMessages />
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
          path="/donor-profile/:username?"
          element={
            <ProtectedRoute allowedRoles={["متبرع"]}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />

        {/* Org */}
        <Route
          path="/org-profile/:username?"
          element={
            <ProtectedRoute allowedRoles={["مؤسسة"]}>
              <OrgProfile />
            </ProtectedRoute>
          }
        />

        {/* Beneficiary || Donor || Org */}
        <Route
          path="/notifications/:username?"
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
