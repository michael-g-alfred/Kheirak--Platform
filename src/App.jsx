import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext/index";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold mb-4">جميع الطلبات</h1>
    //   <PostsList />
    // </div>
  );
}
