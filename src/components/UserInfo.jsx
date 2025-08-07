import uploadImageToCloudinary from "../utils/cloudinary";
import { useAuth } from "../context/authContext";
import ImageIcon from "../icons/ImageIcon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { updateProfile } from "firebase/auth";

export default function UserInfo() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
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
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-[var(--color-bg-text)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
        <label className="cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="User avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--color-secondary-base)] text-[var(--color-bg-muted-text)] border border-[var(--color-bg-divider)] flex items-center justify-center">
              <ImageIcon width={32} height={32} />
            </div>
          )}
        </label>
        <div className="text-start">
          <p>
            <strong>اسم المستخدم:</strong>{" "}
            {currentUser?.displayName || "غير متوفر"}
          </p>
          <p>
            <strong>البريد الإلكتروني:</strong> {currentUser?.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="min-w-fit px-6 py-2 danger rounded">
        تسجيل الخروج
      </button>
    </div>
  );
}
