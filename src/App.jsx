import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext/index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import ChatAi from "./components/ChatAi";

export default function App() {
  return (
    <>

      <Toaster position="bottom-center" />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          {/* your existing layout */}
      <ChatAi apiBase={import.meta.env.VITE_COPILOT_API || "http://localhost:5004"} />
          <AppRoutes />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
