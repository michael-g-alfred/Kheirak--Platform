import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import CardLayout from "../layouts/CardLayout";
import ImageIcon from "../icons/ImageIcon";
import FormLayout from "../layouts/FormLayout";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import Loader from "./Loader";
import { toast } from "react-hot-toast";
import BulletPoints from "./BulletPoints";

const PostCard = ({ newPost }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useAuth();

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
      ("المبلغ يتجاوز القيمة المطلوبة.");
      setIsLoading(false);
      closePopup();
      return;
    }

    try {
      const { doc, updateDoc, arrayUnion, getDoc, setDoc } = await import(
        "firebase/firestore"
      );
      const { getAuth } = await import("firebase/auth");

      const postRef = doc(db, "Posts", newPost.id);
      const auth = getAuth();
      const user = auth.currentUser;

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
        message: `لقد تبرعت بمبلغ ${selectedAmount} :جنيه للطلب ${newPost.title}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: user.uid,
      });

      if (newPost?.submittedBy?.email) {
        const ownerNotifRef = doc(
          db,
          "Notifications",
          newPost.submittedBy.email,
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
          userId: newPost.submittedBy?.uid || "unknown",
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
            message: `شكراً لك! تم الوصول لهدف التبرع للطلب: ${newPost.title}.`,
            timestamp: new Date().toISOString(),
            read: false,
            userId: uid,
          });
        }

        //توليد QR Code وإرسال إشعار لصاحب البوست
        if (newPost?.submittedBy?.email) {
          const qrData = JSON.stringify({
            postId: newPost.id,
            title: newPost.title,
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
            newPost.submittedBy.email,
            "user_Notifications",
            `${Date.now() + 2}`
          );

          await setDoc(qrNotificationRef, {
            title: "اكتمل جمع التبرعات 🎉",
            message: `تم اكتمال جمع التبرعات لطلبك "${newPost.title}". هذا هو رمز الاستجابة السريعة الذي يحتوي على تفاصيل الطلب.`,
            imageUrl: qrCodeURL,
            timestamp: new Date().toISOString(),
            read: false,
            userId: newPost.submittedBy?.uid || "unknown",
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

        <div className="mb-2">
          {newPost.attachedFiles ? (
            <img
              src={newPost.attachedFiles}
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
            {newPost.title || "عنوان الطلب"}
          </h2>
          <span className="bg-[var(--color-bg-base)] text-[var(--color-primary-base)] px-4 py-2 rounded-md font-bold text-sm sm:text-base text-center">
            المبلغ: {amount} ج.م
          </span>
        </div>

        <p className="text-sm text-[var(--color-bg-text)] mb-4 line-clamp-2">
          {newPost.details || "تفاصيل الطلب..."}
        </p>

        {role === "متبرع" && (
          <div className="flex flex-wrap justify-between gap-2">
            {[50, 100, 500, remainingAmount].map((amt, index) => (
              <button
                key={index}
                onClick={() => handleDonateClick(amt)}
                className={`flex-1 min-w-[60px] p-2 rounded font-bold text-sm text-center transition
        ${
          isCompleted
            ? "bg-[var(--color-secondary-disabled)] text-[var(--color-bg-muted-text)] cursor-not-allowed"
            : "bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary-base)]"
        }`}
                disabled={isCompleted}>
                {amt} ج.م
              </button>
            ))}

            <input
              type="text"
              inputMode="numeric"
              disabled={isCompleted}
              placeholder="مبلغ آخر"
              className={`flex-1 min-w-[60px] text-center p-2 rounded font-bold text-sm transition outline-none
      ${
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
              ? `${totalDonated} / ${amount} ج.م — المتبقي: ${remainingAmount} ج.م`
              : "المبلغ مكتمل"}
          </p>
        </div>
      </CardLayout>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <FormLayout
            formTitle={
              <span className="bg-[var(--color-secondary-base)] rounded border border-[var(--color-bg-divider)] p-1 px-2">
                تأكيد تحويل{" "}
                <strong className="text-[var(--color-bg-text)] underline">
                  {selectedAmount} ج.م
                </strong>{" "}
                ؟
              </span>
            }>
            <div className="text-[var(--color-bg-text)] text-right space-y-2 mb-4">
              <p className="text-md">
                سيتم خصم مبلغ{" "}
                <strong className="text-[var(--color-primary-base)]">
                  {selectedAmount} ج.م
                </strong>{" "}
                من رصيدك لصالح الطلب:
                <strong className="mr-1 text-[var(--color-primary-base)]">
                  {newPost.title}
                </strong>
              </p>
              <div className="px-2">
                <BulletPoints content={`تفاصيل الطلب: ${newPost.details}`} />
                <BulletPoints content={`المبلغ الكلى المطلوب: ${amount} ج.م`} />
                <BulletPoints
                  content={`صاحب البوست: ${newPost.submittedBy.userName}`}
                />
                <BulletPoints
                  content={`البريد الإلكترونى لصاحب الطلب: ${newPost.submittedBy.email}`}
                />
              </div>
              <p className="bg-[var(--color-danger-dark)] rounded border border-[var(--color-bg-divider)] p-1 px-2 mt-6 text-center font-bold">
                يرجى التأكد من صحة المبلغ قبل تأكيد العملية.
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
  );
};

export default PostCard;
