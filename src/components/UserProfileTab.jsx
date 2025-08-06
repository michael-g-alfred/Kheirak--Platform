const UserProfileTab = ({ pathPrefix, userName, photoURL }) => {
  return {
    id: `${pathPrefix}-profile/${userName}`,
    label: (
      <div className="flex items-center gap-1">
        <img
          src={photoURL || `https://ui-avatars.com/api/?name=${userName}`}
          alt={userName}
          className="w-7 h-7 er bg-[var(--color-primary-base)] text-[var(--color-secondary-base)] rounded-full object-cover"
        />
        <span>{userName}</span>
      </div>
    ),
  };
};

export default UserProfileTab;
