import { Routes, Route } from "react-router-dom";

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
      <Route path="/dashboard" element={<AdminDashboard />} />
      {/* Donor */}
      <Route path="/donor-profile" element={<DonorProfile />} />
      {/* Org */}
      <Route path="/org-profile" element={<OrgProfile />} />

      <Route path="/logout" element={<Home />} />
    </Routes>
  );
}
