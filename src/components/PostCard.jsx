import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";
import NoPhoto from "./NoPhoto";
import ConfirmModal from "./ConfirmModal";

const PostCard = ({ newPost }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useAuth();
  const navigate = useNavigate();

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

  const amount = Number(newPost.amount || 0);
  const remainingAmount = Math.max(amount - totalDonated, 0);
  const isCompleted = totalDonated >= amount;

  const formattedTime = newPost.timestamp
    ? formatDistanceToNow(
        newPost.timestamp?.toDate
          ? newPost.timestamp.toDate()
          : new Date(newPost.timestamp),
        { addSuffix: true, locale: ar }
      )
    : "";

  const donationPercentage = Math.min((totalDonated / amount) * 100, 100);

  const handleDonateClick = (amount) => {
    setSelectedAmount(amount);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAmount(null);
  };

  const handleConfirmDonation = () => {
    setIsLoading(true);

    if (Number(selectedAmount) <= 0 || isNaN(selectedAmount)) {
      toast.error("يرجى إدخال مبلغ صحيح أكبر من صفر.");
      setIsLoading(false);
      closePopup();
      return;
    }

    const newTotal = totalDonated + Number(selectedAmount);
    if (newTotal > amount) {
      toast.error("المبلغ يتجاوز القيمة المطلوبة.");
      setIsLoading(false);
      closePopup();
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      setIsLoading(false);
      closePopup();
      return;
    }

    // Navigate to payment page with donation data
    navigate("/payment", {
      state: {
        donationData: {
          postId: newPost.id,
          postTitle: newPost.title,
          postDetails: newPost.details,
          donationAmount: Number(selectedAmount),
          totalRequired: amount,
          currentTotal: totalDonated,
          recipient: {
            name: newPost.submittedBy.userName,
            email: newPost.submittedBy.email,
            id: newPost.submittedBy.id
          },
          donor: {
            email: user.email,
            uid: user.uid
          }
        }
      }
    });

    closePopup();
    setIsLoading(false);
  };

  return (
    <>
      <CardLayout>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0">
            {newPost.submittedBy?.userPhoto ? (
              <img
                src={newPost.submittedBy.userPhoto}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border border-[var(--color-bg-divider)]"
              />
            ) : (
              <NoPhoto />
            )}
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="font-bold text-lg text-[var(--color-primary-base)]">
              {newPost.submittedBy?.userName || "اسم المستخدم"}
            </span>
            <span className="text-xs text-[var(--color-bg-text-dark)]">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* صورة + progress bar clip */}
        <div className="mb-2">
          <div className="relative w-full sm:aspect-[4/3] md:aspect-[16/9] xl:aspect-[21/9]rounded-lg border border-[var(--color-bg-divider)] overflow-hidden rounded-lg">
            {newPost.attachedFiles ? (
              <img
                src={newPost.attachedFiles}
                alt="attachment"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-bg-muted-text)]">
                لا توجد صورة
              </div>
            )}

            <div className="absolute bottom-0 left-0 w-full">
              <div className="w-full h-7 bg-[var(--color-primary-disabled)] border-t-1 border-[var(--color-bg-divider)] overflow-hidden relative">
                <div
                  className="h-full bg-[var(--color-primary-base)] transition-all duration-300 text-md font-bold text-[var(--color-bg-text)] flex items-center justify-center"
                  style={{ width: `${donationPercentage}%` }}>
                  {Math.round(donationPercentage)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* العنوان والمبلغ */}
        <div className="flex flex-col gap-2 mb-2">
          <h2 className="font-bold text-xl sm:text-2xl text-[var(--color-primary-base)] line-clamp-2">
            {newPost.title || "عنوان الطلب"}
          </h2>
          <span className="text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] px-4 py-2 rounded font-bold text-sm sm:text-base text-center">
            المبلغ: {amount} ج.م
          </span>
        </div>

        <p className="text-sm text-[var(--color-bg-text-dark)] mb-4 line-clamp-2">
          {newPost.details || "تفاصيل الطلب..."}
        </p>

        {/* أزرار التبرع */}
        {role === "متبرع" && (
          <div className="flex flex-wrap justify-between gap-1 mb-2">
            {[50, 100, 500, remainingAmount].map((amt, index) => (
              <button
                key={index}
                onClick={() => handleDonateClick(amt)}
                className={`flex-1 min-w-[60px] p-2 rounded-lg font-bold text-xs text-center transition
                ${
                  isCompleted
                    ? "bg-[var(--color-primary-disabled)]  text-[var(--color-bg-muted-text)] cursor-not-allowed"
                    : "bg-[var(--color-primary-base)] text-[var(--color-bg-text)] hover:bg-[var(--color-primary-hover)] cursor-pointer "
                } focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]`}
                disabled={isCompleted}>
                {amt} ج.م
              </button>
            ))}

            <input
              type="number"
              step="1"
              min="1"
              disabled={isCompleted}
              placeholder="مبلغ آخر"
              className={`flex-1 min-w-[60px] text-center p-2 rounded-lg font-bold text-xs transition outline-none
${
  isCompleted
    ? "bg-[var(--color-primary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
    : "border border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] text-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-bg-text)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.target.value.trim();
                  const numValue = parseInt(value, 10);
                  if (value && !isNaN(numValue) && numValue >= 1) {
                    handleDonateClick(numValue);
                    e.target.value = "";
                  } else {
                    toast.error("الرجاء إدخال مبلغ صحيح أكبر من صفر");
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();
                const numValue = parseInt(value, 10);
                if (value && !isNaN(numValue) && numValue >= 1) {
                  handleDonateClick(numValue);
                  e.target.value = "";
                } else if (value) {
                  toast.error("الرجاء إدخال مبلغ صحيح أكبر من صفر");
                  e.target.value = "";
                }
              }}
            />
          </div>
        )}

        {/* حالة المبلغ */}
        <p className="w-full text-[var(--color-primary-base)] border-1 border-[var(--color-bg-divider)] p-2 rounded font-bold text-sm sm:text-base text-center">
          {!isCompleted
            ? `${totalDonated} / ${amount} ج.م — المتبقي: ${remainingAmount} ج.م`
            : "المبلغ مكتمل"}
        </p>
      </CardLayout>

      {showPopup && (
        <ConfirmModal
          title={`تأكيد تحويل ${selectedAmount} ج.م`}
          description={`سيتم خصم مبلغ ${selectedAmount} ج.م من رصيدك لصالح الطلب: ${newPost.title}`}
          bulletPoints={[
            `تفاصيل الطلب: ${newPost.details}`,
            `المبلغ الكلي المطلوب: ${amount} ج.م`,
            `صاحب البوست: ${newPost.submittedBy.userName}`,
            `البريد الإلكتروني: ${newPost.submittedBy.email}`,
          ]}
          showInput={false}
          warningText="يرجى التأكد من صحة المبلغ قبل التأكيد."
          confirmText="تأكيد"
          cancelText="إغلاق"
          onConfirm={handleConfirmDonation}
          onClose={closePopup}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default PostCard;
