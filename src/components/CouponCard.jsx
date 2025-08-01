// CouponCard component displays coupon details, manages coupon redemption logic, and shows real-time usage updates.

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import ImageIcon from "../icons/ImageIcon";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

// ------------------------- //
// State variables
// ------------------------- //
const CouponCard = ({ newCoupon }) => {
  const [totalCouponUsed, setTotalCouponUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);

  // ------------------------- //
  // Context
  // ------------------------- //
  const { role } = useAuth();

  // ------------------------- //
  // Firestore subscriptions
  // ------------------------- //
  useEffect(() => {
    if (!newCoupon?.id) return;

    const couponRef = doc(db, "Coupons", newCoupon.id);
    const unsubscribe = onSnapshot(couponRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalCouponUsed(Number(data.totalCouponUsed || 0));
        setBeneficiaries(data.beneficiaries || []);
      }
    });

    return () => unsubscribe();
  }, [newCoupon?.id]);

  // ------------------------- //
  // Derived values
  // ------------------------- //
  const stock = Number(newCoupon.stock || 0);
  const isCompleted = totalCouponUsed >= stock;

  const formattedTime = newCoupon.timestamp
    ? formatDistanceToNow(
        newCoupon.timestamp?.toDate
          ? newCoupon.timestamp.toDate()
          : new Date(newCoupon.timestamp),
        { addSuffix: true, locale: ar }
      )
    : "";

  const { currentUser } = useAuth();
  const userEmail = currentUser?.email || "unknown";

  const hasUsed = beneficiaries.some((donor) => donor.email === userEmail);

  // ------------------------- //
  // Event handlers
  // ------------------------- //
  const handleUseCoupon = async () => {
    if (hasUsed) {
      toast.error("لقد استخدمت هذا الكوبون مسبقاً.");
      return;
    }

    if (isCompleted) {
      toast.error("العدد مكتمل ولا يمكن استخدام المزيد من الكوبونات.");
      return;
    }

    setIsLoading(true);
    const newTotal = totalCouponUsed + 1;

    try {
      const { doc, updateDoc, arrayUnion, getDoc } = await import(
        "firebase/firestore"
      );
      const { getAuth } = await import("firebase/auth");
      const couponRef = doc(db, "Coupons", newCoupon.id);
      const auth = getAuth();
      const user = auth.currentUser;

      const updateData = {
        totalCouponUsed: newTotal,
        beneficiaries: arrayUnion({
          email: user?.email || "unknown",
          stock: 1,
          date: new Date().toISOString(),
        }),
        isCompleted: newTotal >= stock,
      };

      if (newTotal >= stock) {
        updateData.status = "مكتمل";
      }

      await updateDoc(couponRef, updateData);

      toast.success("تم استخدام الكوبون بنجاح. شكراً لك!");

      if (newTotal >= stock) {
        const snapshot = await getDoc(couponRef);
        const data = snapshot.data();
        const beneficiaryEmails = (data?.beneficiaries || []).map(
          (d) => d.email
        );
        // Placeholder for notification logic
        console.log("Notification will be sent to:", beneficiaryEmails);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تنفيذ استخدام الكوبون.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const donationPercentage = Math.min((totalCouponUsed / stock) * 100, 100);

  // ------------------------- //
  // Rendering UI
  // ------------------------- //
  return (
    <>
      <CardLayout className="h-[500px] w-full">
        {/* Header Section: Displays submitter's photo, name, and coupon creation time */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0">
            {newCoupon.submittedBy?.userPhoto ? (
              <img
                src={newCoupon.submittedBy.userPhoto}
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
              {newCoupon.submittedBy?.userName || "اسم المؤسسة"}
            </span>
            <span className="text-xs text-[var(--color-bg-text)]">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Bottom section with image and coupon details side-by-side */}
        <div className="flex flex-col gap-4 items-start mb-4">
          {/* Image Section: Shows attached image or placeholder if none */}
          <div className="w-40 h-40 max-h-[160px]">
            {newCoupon.attachedFiles ? (
              <img
                src={newCoupon.attachedFiles}
                alt="attachment"
                className="w-full h-full object-contain rounded-lg border border-[var(--color-bg-divider)]"
              />
            ) : (
              <div className="w-full h-40 bg-[var(--color-bg-base)] flex items-center justify-center rounded-lg border border-[var(--color-bg-divider)] text-[var(--color-bg-muted-text)]">
                لا توجد صورة
              </div>
            )}
          </div>

          {/* Info Section: Displays title, details, and total coupon count */}
          <div className="space-y-2 text-[var(--color-bg-text)]">
            <h2 className="font-bold text-2xl text-[var(--color-primary-base)]">
              {newCoupon.title || "عنوان الكوبون"}
            </h2>
            <p className="text-sm">
              {newCoupon.details || "تفاصيل الكوبون..."}
            </p>
            <p className="w-full flex justify-center bg-[var(--color-bg-base)] text-[var(--color-primary-base)] px-6 py-2 rounded-md font-bold text-sm">
              {stock} كوبون
            </p>
          </div>
        </div>

        {/* Button Section: Redeem coupon button shown only for beneficiaries */}
        {role === "مستفيد" && (
          <button
            onClick={handleUseCoupon}
            className={`w-full px-6 py-3 rounded font-bold text-md transition ${
              isCompleted || hasUsed
                ? "bg-[var(--color-secondary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
                : "bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary-base)]"
            }`}
            disabled={isCompleted || hasUsed}>
            استخدام كوبون
          </button>
        )}

        {/* Progress Bar Section: Visualizes coupon usage progress */}
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
              ? `${totalCouponUsed} / ${stock} كوبون — المتبقي: ${
                  stock - totalCouponUsed
                } كوبون`
              : "العدد مكتمل"}
          </p>
        </div>
      </CardLayout>
    </>
  );
};

export default CouponCard;
