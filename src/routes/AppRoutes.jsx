import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext/index";

import Home from "../pages/Home";
import Posts from "../pages/Posts";
import Coupons from "../pages/Coupons";
import About from "../pages/About";
import Services from "../pages/Services";
import Portfolio from "../pages/Portfolio";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Registration from "../pages/Registration";
import AdminDashboard from "../pages/AdminDashboard";
import DonorProfile from "../pages/DonorProfile";
import OrgProfile from "../pages/OrgProfile";
import Loader from "../components/Loader";
import Notifications from "../pages/Notifications";

function ProtectedRoute({ children, allowedRoles }) {
  const { role, loading } = useAuth();

  if (loading) return <Loader />;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
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
      {/* Donor */}
      <Route
        path="/donor-profile"
        element={
          <ProtectedRoute allowedRoles={["متبرع"]}>
            <DonorProfile />
          </ProtectedRoute>
        }
      />
      {/* Org */}
      <Route
        path="/org-profile/:name?"
        element={
          <ProtectedRoute allowedRoles={["مؤسسة"]}>
            <OrgProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["متبرع", "مؤسسة", "مستفيد"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route path="/logout" element={<Home />} />
    </Routes>
  );
}
