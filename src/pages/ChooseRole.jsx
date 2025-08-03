import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const roles = ["متبرع", "مستفيد", "مؤسسة"];

const ChooseRole = () => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (userData?.role) {
      navigate("/");
    }
  }, [currentUser, userData, navigate]);

  const handleSubmit = async () => {
    if (!selectedRole) return toast.error("اختر نوع المستخدم");
    try {
      setIsLoading(true);
      await updateDoc(doc(db, "Users", currentUser.uid), {
        role: selectedRole,
      });
      await refreshUserData();
      toast.success("تم تحديد نوع المستخدم");
      navigate("/");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center">اختر نوع المستخدم</h1>
        <div className="space-y-4">
          {roles.map((role) => (
            <label
              key={role}
              className={`block p-3 rounded border cursor-pointer ${
                selectedRole === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <input
                type="radio"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="hidden"
              />
              {role}
            </label>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? "جارٍ الحفظ..." : "تأكيد"}
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
