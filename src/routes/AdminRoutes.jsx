import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Posts from "../pages/Posts";
import Coupons from "../pages/Coupons";
import About from "../pages/About";
import Services from "../pages/Services";
import Portfolio from "../pages/Portfolio";
import Contact from "../pages/Contact";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";

export default function AdminRoutes() {
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
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/logout" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
