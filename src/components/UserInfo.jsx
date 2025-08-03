import { useAuth } from "../context/authContext";
import ImageIcon from "../icons/ImageIcon";

export default function UserInfo() {
  const { currentUser } = useAuth();

  return (
    <div className="text-[var(--color-bg-text)] flex items-center-safe justify-start gap-2">
      {/* صورة المستخدم */}
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
      <div>
        <p>
          <strong>اسم المستخدم:</strong>{" "}
          {currentUser?.displayName || "غير متوفر"}
        </p>
        <p>
          <strong>البريد الإلكتروني:</strong> {currentUser?.email}
        </p>
      </div>
    </div>
  );
}
