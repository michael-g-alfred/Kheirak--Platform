// CouponCard component displays coupon details, manages coupon redemption logic, and shows real-time usage updates.
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import ImageIcon from "../icons/ImageIcon";
import FormLayout from "../layouts/FormLayout";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../Firebase/Firebase";
import BulletPoints from "./BulletPoints";
import Loader from "./Loader";

// ------------------------- //
// State variables
// ------------------------- //
const CouponCard = ({ newCoupon }) => {
  const [totalCouponUsed, setTotalCouponUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAmount(null);
  };

  const handleConfirmDonation = async () => {
    setShowPopup(false);
    toast.loading("جاري تنفيذ استخدام الكوبون...");
    setIsLoading(true);
    const newTotal = totalCouponUsed + 1;

    try {
      const couponRef = doc(db, "Coupons", newCoupon.id);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.dismiss();
        toast.error("يجب تسجيل الدخول أولاً");
        setIsLoading(false);
        return;
      }

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
      toast.dismiss();
      toast.success("تم استخدام الكوبون بنجاح. شكراً لك!");

      // جلب بيانات الكوبون الحالية
      const snapshot = await getDoc(couponRef);
      const data = snapshot.data();

      // إرسال إشعار للمستخدم الذي استخدم الكوبون
      const userNotifRef = doc(
        db,
        "Notifications",
        user.email,
        "user_Notifications",
        `${Date.now()}`
      );
      await setDoc(userNotifRef, {
        title: "كوبون مستخدم ✅",
        message: `لقد استخدمت كوبون "${data.title}" بنجاح.`,
        timestamp: new Date().toISOString(),
        read: false,
      });

      // إرسال إشعار لصاحب الكوبون مع كل استخدام + عند الاكتمال
      const ownerEmail = data.submittedBy?.email;
      if (ownerEmail) {
        // إشعار مع كل استخدام
        const ownerNotifRef = doc(
          db,
          "Notifications",
          ownerEmail,
          "user_Notifications",
          `${Date.now()}`
        );
        await setDoc(ownerNotifRef, {
          title: "تم استخدام كوبون 🔖",
          message: `${user?.email || "مستخدم"} استخدم كوبون "${data.title}".`,
          timestamp: new Date().toISOString(),
          read: false,
        });

        // إشعار خاص عند الاكتمال الكامل
        if (newTotal === stock) {
          const ownerCompleteRef = doc(
            db,
            "Notifications",
            ownerEmail,
            "user_Notifications",
            `${Date.now() + 1}` // لتفادي تطابق المفاتيح
          );
          await setDoc(ownerCompleteRef, {
            title: "اكتمل استخدام الكوبون 🎉",
            message: `تم استخدام جميع كوبونات "${data.title}" بنجاح.`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`حدث خطأ أثناء استخدام الكوبون ‼`);
    }

    setIsLoading(false);
  };

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
  const handleDonateClick = (amount) => {
    setSelectedAmount(Number(amount));
    setShowPopup(true);
  };

  const donationPercentage = Math.min((totalCouponUsed / stock) * 100, 100);

  // ------------------------- //
  // Rendering UI
  // ------------------------- //
  return (
    <>
      <CardLayout>
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

        <div className="mb-2">
          {newCoupon.attachedFiles ? (
            <img
              src={newCoupon.attachedFiles}
              alt="attachment"
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64  xl:h-72 2xl:h-80 object-contain rounded-lg border border-[var(--color-bg-divider)]"
            />
          ) : (
            <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64  xl:h-72 2xl:h-80 object-contain rounded-lg border border-[var(--color-bg-divider)] text-[var(--color-bg-muted-text)]">
              لا توجد صورة
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <h2 className="font-bold text-xl sm:text-2xl text-[var(--color-primary-base)] line-clamp-2">
            {newCoupon.title || "عنوان الطلب"}
          </h2>
          <span className="bg-[var(--color-bg-base)] text-[var(--color-primary-base)] px-4 py-2 rounded-md font-bold text-sm sm:text-base text-center">
            عدد الكوبونات: {stock}
          </span>
        </div>
        <p className="text-sm text-[var(--color-bg-text)] mb-4 line-clamp-2">
          {newCoupon.details || "تفاصيل الطلب..."}
        </p>

        {role === "مستفيد" && (
          <button
            onClick={() => handleDonateClick(1)}
            className={`w-full px-6 py-3 rounded font-bold text-md transition ${
              isCompleted || hasUsed
                ? "bg-[var(--color-secondary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
                : "bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary-base)]"
            }`}
            disabled={isCompleted || hasUsed}>
            استخدام كوبون
          </button>
        )}

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
      <>
        {/* Use confirmation popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
            <FormLayout
              formTitle={
                <span className="bg-[var(--color-secondary-base)] rounded border border-[var(--color-bg-divider)] p-1 px-2">
                  تأكيد استخدام عدد{" "}
                  <strong className="text-[var(--color-bg-text)] underline">
                    ١
                  </strong>{" "}
                  كوبون
                </span>
              }>
              <div className="text-[var(--color-bg-text)] text-right space-y-2 mb-4">
                <p className="text-md">
                  سيتم إستخدام{" "}
                  <strong className="text-[var(--color-primary-base)]">
                    ١
                  </strong>{" "}
                  كوبون من رصيد كوبونات الجهة:
                  <strong className="mr-1 text-[var(--color-primary-base)]">
                    {newCoupon.submittedBy?.userName || "اسم المؤسسة"}
                  </strong>
                </p>
                <div className="px-2">
                  <BulletPoints content={`عنوان الكوبون: ${newCoupon.title}`} />
                  <BulletPoints
                    content={`تفاصيل الكوبون: ${newCoupon.details}`}
                  />
                  <BulletPoints
                    content={`البريد الإلكتروني للجهة: ${newCoupon.submittedBy?.email}`}
                  />
                </div>
                <p className="bg-[var(--color-danger-dark)] rounded border border-[var(--color-bg-divider)] p-1 px-2 mt-6 text-center font-bold">
                  يرجى التأكد من صحة البيانات قبل تأكيد العملية.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="danger px-6 py-2 rounded font-semibold"
                  onClick={closePopup}>
                  إغلاق
                </button>
                <button
                  className="success px-6 py-2 rounded font-semibold"
                  onClick={handleConfirmDonation}>
                  {isLoading ? <Loader /> : "تأكيد"}
                </button>
              </div>
            </FormLayout>
          </div>
        )}
      </>
    </>
  );
};

export default CouponCard;
