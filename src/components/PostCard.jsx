import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import ImageIcon from "../icons/ImageIcon";
import FormLayout from "../layouts/FormLayout";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const PostCard = ({ newPost }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    if (!newPost?.id) return;

    const postRef = doc(db, "Posts", newPost.id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalDonated(Number(data.totalDonated || 0));
      }
    });

    return () => unsubscribe();
  }, [newPost?.id]);

  const requestedAmount = Number(newPost.requestedAmount || 0);
  const isCompleted = totalDonated >= requestedAmount;

  const formattedTime = newPost.timestamp
    ? formatDistanceToNow(
        newPost.timestamp?.toDate
          ? newPost.timestamp.toDate()
          : new Date(newPost.timestamp),
        { addSuffix: true, locale: ar }
      )
    : "";

  const donationPercentage = Math.min(
    (totalDonated / requestedAmount) * 100,
    100
  );

  const handleDonateClick = (amount) => {
    setSelectedAmount(amount);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAmount(null);
  };

  const handleConfirmDonation = async () => {
    const newTotal = totalDonated + Number(selectedAmount);
    if (newTotal > requestedAmount) {
      alert("المبلغ يتجاوز القيمة المطلوبة.");
      closePopup();
      return;
    }
    try {
      const postRef = doc(db, "Posts", newPost.id);
      const updateData = { totalDonated: newTotal };

      if (newTotal >= requestedAmount) {
        updateData.status = "مكتمل";
      }

      await updateDoc(postRef, updateData);

      alert(`تم التبرع بـ ${selectedAmount} ج.م`);
    } catch (error) {
      console.error("خطأ في تحديث التبرع:", error);
      alert("حدث خطأ أثناء تنفيذ التبرع.");
    }
    closePopup();
  };

  return (
    <>
      <CardLayout>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0">
            {newPost.submittedBy?.userPhoto ? (
              <img
                src={newPost.submittedBy.userPhoto}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-secondary-base)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-secondary-base)] flex items-center justify-center text-[var(--color-bg-muted-text)] text-2xl">
                <ImageIcon height={36} width={36} />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="font-bold text-lg text-[var(--color-primary-base)]">
              {newPost.submittedBy?.userName || "اسم المستخدم"}
            </span>
            <span className="text-xs text-[var(--color-bg-text)]">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Attached Image */}
        <div className="mb-2">
          {newPost.attachedFiles ? (
            <img
              src={newPost.attachedFiles}
              alt="attachment"
              className="w-full h-100 object-contain rounded-lg border border-[var(--color-bg-divider)]"
            />
          ) : (
            <div className="w-full h-100 bg-[var(--color-bg-base)] flex items-center justify-center rounded-lg border border-[var(--color-bg-divider)] text-[var(--color-bg-muted-text)]">
              لا توجد صورة
            </div>
          )}
        </div>

        {/* Title & Amount */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-2xl text-[var(--color-primary-base)]">
            {newPost.requestTitle || "عنوان الطلب"}
          </h2>
          <span className="bg-[var(--color-bg-base)] text-[var(--color-primary-base)] px-6 py-2 rounded-md font-bold text-sm">
            {requestedAmount} ج.م
          </span>
        </div>

        {/* Details */}
        <p className="text-sm text-[var(--color-bg-text)] mb-4">
          {newPost.details || "تفاصيل الطلب..."}
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-1">
          {[50, 100, 500, requestedAmount].map((amount, index) => (
            <button
              key={index}
              onClick={() => handleDonateClick(amount)}
              className={`w-full p-2 rounded font-bold text-sm transition ${
                isCompleted
                  ? "bg-[var(--color-secondary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
                  : "bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary-base)]"
              }`}
              disabled={isCompleted}>
              {amount} ج.م
            </button>
          ))}

          {/* مبلغ آخر */}
          <input
            type="text"
            inputMode="numeric"
            disabled={isCompleted}
            placeholder="مبلغ آخر"
            className={`w-full text-center p-2 rounded font-bold text-sm transition outline-none ${
              isCompleted
                ? "bg-[var(--color-secondary-disabled)] text-[var(--color-bg-muted-text)]"
                : "bg-[var(--color-secondary-base)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-bg-text)] border-2 border-[var(--color-bg-divider)]"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.target.value.trim();
                if (value && !isNaN(value)) {
                  handleDonateClick(value);
                  e.target.value = "";
                }
              }
            }}
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value && !isNaN(value)) {
                handleDonateClick(value);
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-2">
          <div className="w-full h-6 rounded bg-[var(--color-secondary-disabled)] border-2 border-[var(--color-secondary-base)] overflow-hidden relative">
            <div
              className="h-full bg-[var(--color-primary-base)] transition-all duration-300 text-md font-bold text-[var(--color-secondary-base)] flex items-center justify-center"
              style={{ width: `${donationPercentage}%` }}>
              {Math.round(donationPercentage)}%
            </div>
          </div>
          <p className="text-md font-bold text-[var(--color-bg-muted-text)] text-center mt-1">
            {!isCompleted
              ? `${totalDonated} / ${requestedAmount} ج.م — المتبقي: ${
                  requestedAmount - totalDonated
                } ج.م`
              : "المبلغ مكتمل"}
          </p>
        </div>
      </CardLayout>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <FormLayout
            formTitle={
              <span>
                تأكيد تحويل{" "}
                <strong className="text-[var(--color-bg-text)] underline">
                  {selectedAmount} ج.م
                </strong>{" "}
                ؟
              </span>
            }>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="success px-6 py-2 rounded font-semibold"
                onClick={handleConfirmDonation}>
                تأكيد
              </button>
              <button
                className="danger px-6 py-2 rounded font-semibold"
                onClick={closePopup}>
                إغلاق
              </button>
            </div>
          </FormLayout>
        </div>
      )}
    </>
  );
};

export default PostCard;
