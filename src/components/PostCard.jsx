import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
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
import { toast } from "react-hot-toast";
import NoPhoto from "./NoPhoto";
import ConfirmModal from "./ConfirmModal";
import ImageIcon from "../icons/ImageIcon";
import Divider from "./Divider";
import { motion } from "framer-motion";
import { categoryPartners as importedCategoryPartners } from "../data/categories";
const categoryPartners = importedCategoryPartners || {};

const PostCard = ({ newPost }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useAuth();

  const submittedByUserName = newPost.submittedBy?.userName || "غير معرف";
  const submittedByEmail = newPost.submittedBy?.email || "غير معرف";
  const submittedByUid = newPost.submittedBy?.uid || "غير معرف";
  const postTitle = newPost.title || "غير معرف";
  const postDetails = newPost.details || "غير معرف";
  const postType = newPost.type || "غير معرف";

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

  const handleConfirmDonation = async () => {
    toast.loading("جاري تنفيذ التبرع...");
    setIsLoading(true);

    if (Number(selectedAmount) <= 0 || isNaN(selectedAmount)) {
      toast.dismiss();
      toast.error("يرجى إدخال مبلغ صحيح أكبر من صفر.");
      setIsLoading(false);
      closePopup();
      return;
    }

    const newTotal = totalDonated + Number(selectedAmount);
    if (newTotal > amount) {
      toast.dismiss();
      toast.error("المبلغ يتجاوز القيمة المطلوبة.");
      setIsLoading(false);
      closePopup();
      return;
    }

    try {
      const postRef = doc(db, "Posts", newPost.id);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.dismiss();
        toast.error("يجب تسجيل الدخول أولاً");
        setIsLoading(false);
        closePopup();
        return;
      }

      const updateData = {
        totalDonated: newTotal,
        donors: arrayUnion({
          email: user?.email || "unknown",
          uid: user?.uid || "unknown",
          amount: Number(selectedAmount),
          date: new Date().toISOString(),
        }),
        isCompleted: newTotal >= amount,
      };

      if (newTotal >= amount) {
        updateData.status = "مكتمل";
      }

      await updateDoc(postRef, updateData);
      toast.dismiss();
      toast.success(`تم التبرع بـ ${selectedAmount} ج.م`, {
        position: "bottom-center",
      });

      const donorNotifRef = doc(
        db,
        "Notifications",
        user.email,
        "user_Notifications",
        `${Date.now()}`
      );

      await setDoc(donorNotifRef, {
        title: "شكرًا على تبرعك 💚",
        message: `لقد تبرعت بمبلغ ${selectedAmount} :جنيه للطلب ${postTitle}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: user.uid,
      });

      if (submittedByEmail !== "غير معرف") {
        const ownerNotifRef = doc(
          db,
          "Notifications",
          submittedByEmail,
          "user_Notifications",
          `${Date.now() + 1}`
        );

        await setDoc(ownerNotifRef, {
          title: "تم استلام تبرع جديد ✅",
          message: `${
            user?.email || "مستخدم"
          } تبرع لك بمبلغ ${selectedAmount} جنيه.`,
          timestamp: new Date().toISOString(),
          read: false,
          userId: submittedByUid,
        });
      }

      if (newTotal >= amount) {
        const snapshot = await getDoc(postRef);
        const data = snapshot.data();

        const donorMap = (data?.donors || []).reduce((acc, d) => {
          if (d.email && !acc[d.email]) {
            acc[d.email] = d.uid || "unknown";
          }
          return acc;
        }, {});

        for (const [email, uid] of Object.entries(donorMap)) {
          const notificationRef = doc(
            db,
            "Notifications",
            email,
            "user_Notifications",
            `${Date.now() + Math.floor(Math.random() * 1000)}`
          );

          await setDoc(notificationRef, {
            title: "شكرًا على تبرعك 💚",
            message: `شكراً لك! تم الوصول لهدف التبرع للطلب: ${postTitle}.`,
            timestamp: new Date().toISOString(),
            read: false,
            userId: uid,
          });
        }

        if (submittedByEmail !== "غير معرف") {
          const partners = categoryPartners[postType] || [];
          const partnersList = partners.length
            ? partners.join("، ")
            : "أحد نقاط التوزيع المعتمدة";

          const qrData = JSON.stringify({
            postId: newPost.id,
            title: postTitle,
            type: postType,
            amount,
            totalDonated: newTotal,
            submittedBy: newPost.submittedBy,
          });

          const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            qrData
          )}&size=150x150`;

          const qrNotificationRef = doc(
            db,
            "Notifications",
            submittedByEmail,
            "user_Notifications",
            `${Date.now() + 2}`
          );

          await setDoc(qrNotificationRef, {
            title: "اكتمل جمع التبرعات 🎉",
            message: `تم اكتمال جمع التبرعات لطلبك "${postTitle}". هذا هو رمز الاستجابة السريعة الذي يحتوي على تفاصيل الطلب. يمكن التوجهة إلى أحد شركائنا (${partnersList}) لاستلام الخدمة.`,
            imageUrl: qrCodeURL,
            timestamp: new Date().toISOString(),
            read: false,
            userId: submittedByUid,
          });
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error("حدث خطأ أثناء تنفيذ التبرع ‼. يرجى المحاولة مرة أخرى.");
    }

    setIsLoading(false);
    closePopup();
  };

  return (
    <>
      <CardLayout>
        <div className="flex flex-col gap-2">
          {/* بيانات صاحب الطلب */}
          <div className="flex items-center gap-2">
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
                {submittedByUserName}
              </span>
              <span className="text-xs text-[var(--color-bg-text-dark)]">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* صورة + progress bar */}
          <div className="relative w-full h-50 rounded-lg border border-[var(--color-bg-divider)] overflow-hidden">
            {newPost.attachedFiles ? (
              <img
                src={newPost.attachedFiles}
                alt="attachment"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-card-dark)] text-[var(--color-bg-muted-text)]">
                <ImageIcon size={48} />
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full">
              <div className="w-full h-7 bg-[var(--color-primary-disabled)] border-t-1 border-[var(--color-bg-divider)] overflow-hidden relative">
                <motion.div
                  className="h-full bg-[var(--color-primary-base)] text-md font-bold text-[var(--color-bg-text)] flex items-center justify-center"
                  initial={{ width: 0 }}
                  animate={{ width: `${donationPercentage}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}>
                  {Math.round(donationPercentage)}%
                </motion.div>
              </div>
            </div>
          </div>

          {/* العنوان والمبلغ */}
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-xl sm:text-2xl text-[var(--color-primary-base)] line-clamp-2 text-center">
              {postTitle}
            </h2>
            <p className="text-sm text-[var(--color-bg-text-dark)] line-clamp-2">
              {postDetails}
            </p>
            <Divider my={0} />
            <span className="text-[var(--color-primary-base)] rounded font-medium text-md text-right">
              المبلغ المطلوب: {amount} ج.م
            </span>

            <div className="w-full bg-[var(--color-bg-card-dark)] px-4 py-2 flex justify-between items-center rounded-full text-[var(--color-primary-base)]">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-xs font-medium">إجمالي التبرعات</span>
                <span className="font-bold text-xs">{totalDonated} ج.م</span>
              </div>

              {/* الفاصل العمودي */}
              <div className="border border-[var(--color-bg-divider)] h-8 rounded-full"></div>

              <div className="flex-1 flex flex-col items-center">
                <span className="text-xs font-medium">المبلغ المتبقي</span>
                <span className="font-bold text-xs">{remainingAmount} ج.م</span>
              </div>
            </div>
          </div>

          {role === "متبرع" && <Divider my={0} />}

          {/* أزرار التبرع */}
          {role === "متبرع" && (
            <div className="flex flex-wrap justify-between gap-1">
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
    : "border border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] text-[var(--color-primary-base)]  cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
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
        </div>
      </CardLayout>

      {showPopup && (
        <ConfirmModal
          title={`تأكيد تحويل ${selectedAmount} ج.م`}
          description={`سيتم خصم مبلغ ${selectedAmount} ج.م من رصيدك لصالح الطلب: ${postTitle}`}
          bulletPoints={[
            `تفاصيل الطلب: ${postDetails}`,
            `المبلغ الكلي المطلوب: ${amount} ج.م`,
            `صاحب البوست: ${submittedByUserName}`,
            `البريد الإلكتروني: ${submittedByEmail}`,
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
