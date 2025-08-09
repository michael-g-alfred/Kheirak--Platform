const UserProfileTab = ({ pathPrefix, userName, photoURL }) => {
  return {
    id: `${pathPrefix}-profile/${userName}`,
    label: (
      <div className="flex items-center gap-2" dir="rtl">
        <img
          src={
            photoURL ||
            `https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`
          }
          alt={`صورة الملف الشخصي لـ ${userName}`}
          className="w-7 h-7 rounded-full object-cover border border-[var(--color-bg-divider)]"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`;
          }}
        />
        <span>{userName}</span>
      </div>
    ),
  };
};

export default UserProfileTab;
