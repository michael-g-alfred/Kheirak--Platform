import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import GuestRoutes from "./routes/GuestRoutes";
// import DonorRoutes from "./routes/DonorRoutes";
// import OrgRoutes from "./routes/OrgRoutes";
// import AdminRoutes from "./routes/AdminRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <GuestRoutes />
        {/* <DonorRoutes />
        <OrgRoutes />
        <AdminRoutes /> */}
      </AuthProvider>
    </BrowserRouter>
  );
}
