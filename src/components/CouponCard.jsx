import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
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
import NoPhoto from "./NoPhoto";

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

  const handleConfirmCouponUSed = async () => {
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
                className="w-16 h-16 rounded-full object-cover border border-[var(--color-bg-divider)]"
              />
            ) : (
              <NoPhoto />
            )}
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="font-bold text-lg text-[var(--color-primary-base)]">
              {newCoupon.submittedBy?.userName || "اسم المستخدم"}
            </span>
            <span className="text-xs text-[var(--color-bg-text-dark)]">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* صورة + progress bar clip */}
        <div className="mb-2">
          <div className="relative w-full sm:aspect-[4/3] md:aspect-[16/9] xl:aspect-[21/9] rounded-lg border border-[var(--color-bg-divider)] overflow-hidden">
            {newCoupon.attachedFiles ? (
              <img
                src={newCoupon.attachedFiles}
                alt="attachment"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-bg-muted-text)]">
                لا توجد صورة
              </div>
            )}
          </div>
        </div>

        {/* العنوان وعدد الكوبونات */}
        <div className="flex flex-col gap-2 mb-2">
          <h2 className="font-bold text-xl sm:text-2xl text-[var(--color-primary-base)] line-clamp-2">
            {newCoupon.title || "عنوان الكوبون"}
          </h2>
          <p className="text-sm text-[var(--color-bg-text-dark)] line-clamp-2">
            النوع: <strong>{newCoupon.type}</strong>
          </p>
          <p className="text-sm text-[var(--color-bg-text-dark)] line-clamp-2">
            {newCoupon.details || "تفاصيل الكوبون..."}
          </p>
          <p className="w-full text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] px-4 py-2 rounded font-bold text-sm sm:text-base text-center">
            عدد الكوبونات المتاحة: {stock - totalCouponUsed}
          </p>
        </div>

        {/* أزرار الإستخدام */}
        {role === "مستفيد" && (
          <button
            onClick={() => handleDonateClick(1)}
            className={`w-full px-6 py-3 rounded-lg font-bold text-md mb-2 transition ${
              isCompleted || hasUsed
                ? "bg-[var(--color-primary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
                : "bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg-text)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
            }`}
            disabled={isCompleted || hasUsed}>
            استخدام كوبون
          </button>
        )}
      </CardLayout>
      <>
        {/* Use confirmation popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
            <FormLayout
              formTitle={
                <span className="text-[var(--color-primary-base)] rounded">
                  تأكيد استخدام عدد{" "}
                  <strong className="text-[var(--color-bg-muted-text)] underline">
                    ١
                  </strong>{" "}
                  كوبون
                </span>
              }>
              <div className="text-[var(--color-bg-text-dark)] text-right space-y-2 mb-4">
                <p className="text-md">
                  سيتم إستخدام{" "}
                  <strong className="text-[var(--color-primary-base)]">
                    ١
                  </strong>{" "}
                  كوبون من رصيد كوبونات الجهة:
                  <strong className="mr-1">
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
                <p className="bg-[var(--color-danger-light)] text-[var(--color-bg-text)] rounded border border-[var(--color-bg-divider)] p-1 px-2 mt-6 text-center font-bold">
                  يرجى التأكد من صحة البيانات قبل تأكيد العملية.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="danger px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-danger-light)]"
                  onClick={closePopup}>
                  إغلاق
                </button>
                <button
                  className="success px-6 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-success-light)]"
                  onClick={handleConfirmCouponUSed}>
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
