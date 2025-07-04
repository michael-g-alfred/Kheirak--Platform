import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Posts from "../pages/Posts";
import Coupons from "../pages/Coupons";
import About from "../pages/About";
import Services from "../pages/Services";
import Portfolio from "../pages/Portfolio";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function GuestRoutes() {
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
