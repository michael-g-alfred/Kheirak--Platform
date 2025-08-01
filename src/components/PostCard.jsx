// PostCard.jsx
// This component renders a donation request card that displays details about the request,
// allows donors to select or input donation amounts, shows real-time donation progress,
// and handles donation confirmation with updates to Firestore.

import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import ImageIcon from "../icons/ImageIcon";
import FormLayout from "../layouts/FormLayout";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

// -------------------------
// PostCard component
// -------------------------
const PostCard = ({ newPost }) => {
  // -------------------------
  // State variables
  // -------------------------
  // showPopup: controls visibility of the donation confirmation popup
  // selectedAmount: stores the donation amount chosen by the user
  // totalDonated: current total donated amount for this post, synced with Firestore
  // isLoading: indicates if a donation update is in progress
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------
  // Authentication context
  // -------------------------
  // Retrieve the current user's role
  const { role } = useAuth();

  // -------------------------
  // Firestore real-time listener
  // -------------------------
  // Listen to changes on the specific post document to update totalDonated state
  useEffect(() => {
    if (!newPost?.id) return; // Exit if no post ID is provided

    const postRef = doc(db, "Posts", newPost.id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Update totalDonated from Firestore data, defaulting to zero if undefined
        setTotalDonated(Number(data.totalDonated || 0));
      }
    });

    // Cleanup subscription on component unmount or post ID change
    return () => unsubscribe();
  }, [newPost?.id]);

  // -------------------------
  // Derived variables
  // -------------------------
  // Target donation amount for this request
  const amount = Number(newPost.amount || 0);
  // Flag indicating if donation goal is reached or exceeded
  const isCompleted = totalDonated >= amount;

  // Format timestamp to relative time string in Arabic locale
  const formattedTime = newPost.timestamp
    ? formatDistanceToNow(
        newPost.timestamp?.toDate
          ? newPost.timestamp.toDate()
          : new Date(newPost.timestamp),
        { addSuffix: true, locale: ar }
      )
    : "";

  // Calculate donation progress percentage capped at 100%
  const donationPercentage = Math.min((totalDonated / amount) * 100, 100);

  // -------------------------
  // Event handlers
  // -------------------------

  // Open confirmation popup with selected donation amount
  const handleDonateClick = (amount) => {
    setSelectedAmount(amount);
    setShowPopup(true);
  };

  // Close the donation confirmation popup and reset selected amount
  const closePopup = () => {
    setShowPopup(false);
    setSelectedAmount(null);
  };

  // Confirm donation and update Firestore with new totals and donor info
  const handleConfirmDonation = async () => {
    toast.loading("جاري تنفيذ التبرع...");
    setIsLoading(true);
    const newTotal = totalDonated + Number(selectedAmount);

    // Prevent donation exceeding requested amount
    if (newTotal > amount) {
      toast.dismiss();
      alert("المبلغ يتجاوز القيمة المطلوبة.");
      setIsLoading(false);
      closePopup();
      return;
    }

    try {
      // Dynamically import Firestore and Auth modules to avoid conflicts
      const { doc, updateDoc, arrayUnion, getDoc } = await import(
        "firebase/firestore"
      );
      const { getAuth } = await import("firebase/auth");

      const postRef = doc(db, "Posts", newPost.id);
      const auth = getAuth();
      const user = auth.currentUser;

      // Prepare update data including new total, donor details, and completion status
      const updateData = {
        totalDonated: newTotal,
        donors: arrayUnion({
          email: user?.email || "unknown",
          amount: Number(selectedAmount),
          date: new Date().toISOString(),
        }),
        isCompleted: newTotal >= amount,
      };

      // Update status to "مكتمل" if donation goal is reached
      if (newTotal >= amount) {
        updateData.status = "مكتمل";
      }

      // Apply updates to Firestore document
      await updateDoc(postRef, updateData);

      toast.dismiss();
      toast.success(`تم التبرع بـ ${selectedAmount} ج.م`);
      if (typeof onDonation === "function") onDonation();

      // If donation goal reached, log donor emails for notification (placeholder)
      if (newTotal >= amount) {
        const snapshot = await getDoc(postRef);
        const data = snapshot.data();
        const donorEmails = (data?.donors || []).map((d) => d.email);
        console.log("سيتم إرسال إشعار إلى:", donorEmails);

        // TODO: Implement forced notification sending via FCM instead of console.log
      }
    } catch (error) {
      toast.dismiss();
      toast.error("حدث خطأ أثناء تنفيذ التبرع.");
      alert("حدث خطأ أثناء تنفيذ التبرع.");
      setIsLoading(false);
      closePopup();
      return;
    }

    // Reset loading state and close popup after successful donation
    setIsLoading(false);
    closePopup();
  };

  // -------------------------
  // Render UI
  // -------------------------
  return (
    <>
      <CardLayout>
        {/* Header with user photo and name */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0">
            {newPost.submittedBy?.userPhoto ? (
              <img
                src={newPost.submittedBy.userPhoto}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-secondary-base)]"
              />
            ) : (
              // Placeholder icon when no user photo available
              <div className="w-16 h-16 rounded-full bg-[var(--color-secondary-base)] flex items-center justify-center text-[var(--color-bg-muted-text)] text-2xl">
                <ImageIcon height={36} width={36} />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start flex-1">
            {/* Display user name or fallback text */}
            <span className="font-bold text-lg text-[var(--color-primary-base)]">
              {newPost.submittedBy?.userName || "اسم المستخدم"}
            </span>
            {/* Display relative formatted timestamp */}
            <span className="text-xs text-[var(--color-bg-text)]">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Attached image or placeholder */}
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

        {/* Request title and target amount */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-2xl text-[var(--color-primary-base)]">
            {newPost.requestTitle || "عنوان الطلب"}
          </h2>
          <span className="bg-[var(--color-bg-base)] text-[var(--color-primary-base)] px-6 py-2 rounded-md font-bold text-sm">
            {amount} ج.م
          </span>
        </div>

        {/* Request details description */}
        <p className="text-sm text-[var(--color-bg-text)] mb-4">
          {newPost.details || "تفاصيل الطلب..."}
        </p>

        {/* Donation options visible only to donors */}
        {role === "متبرع" && (
          <div className="flex justify-between gap-1">
            {/* Buttons for preset donation amounts including full amount */}
            {[50, 100, 500, amount].map((amount, index) => (
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

            {/* Custom donation amount input */}
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
              // Submit custom amount on Enter key press
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.target.value.trim();
                  if (value && !isNaN(value)) {
                    handleDonateClick(value);
                    e.target.value = "";
                  }
                }
              }}
              // Submit custom amount on input blur if valid
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value && !isNaN(value)) {
                  handleDonateClick(value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        )}

        {/* Donation progress bar */}
        <div className="w-full mt-2">
          <div className="w-full h-6 rounded bg-[var(--color-secondary-disabled)] border-2 border-[var(--color-secondary-base)] overflow-hidden relative">
            <div
              className="h-full bg-[var(--color-primary-base)] transition-all duration-300 text-md font-bold text-[var(--color-secondary-base)] flex items-center justify-center"
              style={{ width: `${donationPercentage}%` }}>
              {Math.round(donationPercentage)}%
            </div>
          </div>
          {/* Progress text showing current total, target, and remaining amount or completion */}
          <p className="text-md font-bold text-[var(--color-bg-muted-text)] text-center mt-1">
            {!isCompleted
              ? `${totalDonated} / ${amount} ج.م — المتبقي: ${
                  amount - totalDonated
                } ج.م`
              : "المبلغ مكتمل"}
          </p>
        </div>
      </CardLayout>
      {/* Donation confirmation popup */}
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
                {isLoading ? <Loader /> : "تأكيد"}
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
