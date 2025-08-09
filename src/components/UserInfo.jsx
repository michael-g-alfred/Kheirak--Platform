import uploadImageToCloudinary from "../utils/cloudinary";
import { useAuth } from "../context/authContext";
import ImageIcon from "../icons/ImageIcon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function UserInfo({ info = true }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    try {
      setUploading(true);
      toast.loading("جاري رفع الصورة...");

      const imageUrl = await uploadImageToCloudinary(file);
      console.log("Uploaded image URL:", imageUrl);

      const userDocRef = doc(db, "Users", currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL: imageUrl,
      });

      await updateProfile(currentUser, {
        photoURL: imageUrl,
      });

      if (currentUser) {
        currentUser.photoURL = imageUrl;
      }

      toast.dismiss();
      toast.success("تم تحديث صورة الملف الشخصي بنجاح");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss();
      toast.error("خطأ في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="text-[var(--color-bg-text)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 w-full"
      dir="rtl">
      {info && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <label
            className="cursor-pointer relative"
            aria-label="تغيير صورة الملف الشخصي">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploading}
              aria-describedby="avatar-help"
            />
            {uploading ? (
              <div className="w-16 h-16 rounded-full bg-[var(--color-secondary-base)] border border-[var(--color-bg-divider)] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[var(--color-primary-base)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="صورة الملف الشخصي"
                className="w-16 h-16 rounded-full object-cover border hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-secondary-base)] text-[var(--color-bg-muted-text)] border border-[var(--color-bg-divider)] flex items-center justify-center hover:bg-[var(--color-primary-base)] hover:text-white transition-colors">
                <ImageIcon width={32} height={32} />
              </div>
            )}
            <div id="avatar-help" className="sr-only">
              اضغط لتغيير صورة الملف الشخصي. الحد الأقصى للحجم 2 ميجابايت.
            </div>
          </label>
          <div className="text-right">
            <p className="mb-1">
              <strong>اسم المستخدم:</strong>{" "}
              <span className="text-[var(--color-primary-base)]">
                {currentUser?.displayName || "غير متوفر"}
              </span>
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong>{" "}
              <span className="text-[var(--color-primary-base)]">
                {currentUser?.email}
              </span>
            </p>
          </div>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="min-w-fit px-6 py-2 danger_Outline rounded"
        aria-label="تسجيل الخروج من الحساب">
        تسجيل الخروج
      </button>
    </div>
  );
}
