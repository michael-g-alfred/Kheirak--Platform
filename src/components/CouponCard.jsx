import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
  query,
  getDocs,
  where,
  collection,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../Firebase/Firebase";
import NoPhoto from "./NoPhoto";
import ImageIcon from "../icons/ImageIcon";
import ConfirmModal from "./ConfirmModal";
import Divider from "./Divider";

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
      // Check the last usage of a coupon of the same type
      // Before allowing the user to use a new coupon of the same type,
      // we check in the "CouponUsage" collection if their last usage was less than 24 hours ago.
      if (newCoupon?.type) {
        const usageRef = collection(db, "CouponUsage");

        //  Get the latest usage record for the current user and this coupon type

        const q = query(
          usageRef,
          where("userId", "==", user.uid),
          where("couponType", "==", newCoupon.type),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        let usedRecently = false;

        if (!querySnapshot.empty) {
          const lastUsage = querySnapshot.docs[0].data();

          // Calculate the difference in hours between now and the last usage
          if (lastUsage.timestamp) {
            const hoursDiff = differenceInHours(
              new Date(),
              lastUsage.timestamp.toDate()
            );
            if (hoursDiff < 24) {
              usedRecently = true;
            }
          }
        }

        //  If less than 24 hours have passed, block usage and show an error message
        if (usedRecently) {
          toast.dismiss();
          toast.error(
            "لا يمكنك استخدام كوبون آخر من نفس النوع قبل مرور 24 ساعة"
          );
          setIsLoading(false);
          return;
        }

        //  If allowed, record the new usage in the "CouponUsage" collection
        await addDoc(usageRef, {
          userId: user.uid,
          couponType: newCoupon.type,
          timestamp: serverTimestamp(),
        });
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
      console.error("Error using coupon:", error);
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
        <div className="flex flex-col gap-2">
          {/* بيانات صاحب الطلب */}
          <div className="flex items-center gap-2">
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
                {newCoupon.submittedBy?.userName || "غير معرف"}
              </span>
              <span className="text-xs text-[var(--color-bg-text-dark)]">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* صورة + progress bar clip */}
          <div className="relative w-full h-50 rounded-lg border border-[var(--color-bg-divider)] overflow-hidden">
            {newCoupon.attachedFiles ? (
              <img
                src={newCoupon.attachedFiles}
                alt="attachment"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-card-dark)] text-[var(--color-bg-muted-text)]">
                <ImageIcon size={48} />
              </div>
            )}
          </div>

          {/* العنوان وعدد الكوبونات */}
          <div className="flex flex-col gap-2">
            <h2 className="text-center font-bold text-xl sm:text-2xl text-[var(--color-primary-base)] line-clamp-2">
              {newCoupon.title || "غير معرف"}
            </h2>
            <p className="text-sm text-[var(--color-bg-text-dark)] line-clamp-2">
              النوع: <strong>{newCoupon.type || "غير معرف"}</strong>
            </p>
            <p className="text-sm text-[var(--color-bg-text-dark)] line-clamp-2">
              {newCoupon.details || "غير معرف"}
            </p>

            <p className="w-full text-[var(--color-primary-base)] bg-[var(--color-bg-card-dark)] px-4 py-2 font-bold text-sm sm:text-base text-center rounded-full">
              عدد الكوبونات المتاحة:{" "}
              {stock != null && totalCouponUsed != null
                ? stock - totalCouponUsed
                : "غير معرف"}
            </p>
          </div>

          {role === "مستفيد" && <Divider my={0} />}

          {/* أزرار الإستخدام */}
          {role === "مستفيد" && (
            <button
              onClick={() => handleDonateClick(1)}
              className={`w-full px-6 py-3 rounded-lg font-bold text-md transition ${
                isCompleted
                  ? "bg-[var(--color-primary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
                  : "bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg-text)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
              }`}
              disabled={isCompleted}>
              استخدام كوبون
            </button>
          )}
        </div>
      </CardLayout>
      <>
        {/* Use confirmation popup */}
        {showPopup && (
          <ConfirmModal
            title="تأكيد استخدام كوبون"
            description={`سيتم استخدام ${1} كوبون من الجهة: ${
              newCoupon.submittedBy?.userName || "غير معرف"
            }`}
            bulletPoints={[
              `عنوان الكوبون: ${newCoupon.title || "غير معرف"}`,
              `تفاصيل الكوبون: ${newCoupon.details || "غير معرف"}`,
              `البريد الإلكتروني للجهة: ${
                newCoupon.submittedBy?.email || "غير معرف"
              }`,
            ]}
            showInput={false}
            warningText="يرجى التأكد من صحة البيانات قبل التأكيد."
            confirmText="تأكيد"
            cancelText="إغلاق"
            onConfirm={handleConfirmCouponUSed}
            onClose={closePopup}
            isLoading={isLoading}
          />
        )}
      </>
    </>
  );
};

export default CouponCard;
