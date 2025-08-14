import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc, 
  setDoc 
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import PaymentModal from "../components/PaymentModal";
import "./Payment.css";

// Initialize Stripe
// To use this, create a .env file in your project root and add:
// VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_publishable_key_here";
const stripePromise = loadStripe(stripePublishableKey);

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [donationData, setDonationData] = useState(null);
  
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    firstName: "",
    lastName: "",
    country: "مصر",
    vatId: "",
  });

  useEffect(() => {
    // Get donation data from navigation state
    const navDonationData = location.state?.donationData;
    if (navDonationData) {
      setDonationData(navDonationData);
    } else {
      // If no donation data, redirect to home
      toast.error("لا توجد بيانات تبرع. يرجى المحاولة مرة أخرى.");
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.firstName || !form.lastName) {
      toast.error("يرجى إدخال الاسم الأول واسم العائلة");
      return;
    }
    
    // Show Stripe payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!donationData) {
      toast.error("خطأ في بيانات التبرع");
      return;
    }

    setShowPaymentModal(false);
    
    // Always show success message first
    toast.dismiss();
    toast.success(` تم الدفع والتبرع بنجاح! تبرعت بـ ${donationData.donationAmount} ج.م`, {
      duration: 3000,
    });

    // Reset form
    setForm({
      cardNumber: "",
      expiry: "",
      cvv: "",
      firstName: "",
      lastName: "",
      country: "مصر",
      vatId: "",
    });

    // Try to update database in the background
    try {
      
      const { 
        postId, 
        donationAmount, 
        totalRequired, 
        currentTotal, 
        donor, 
        recipient,
        postTitle 
      } = donationData;

      const newTotal = currentTotal + donationAmount;
      const postRef = doc(db, "Posts", postId);

      // Update post with donation
      const updateData = {
        totalDonated: newTotal,
        donors: arrayUnion({
          email: donor.email,
          uid: donor.uid,
          amount: donationAmount,
          date: new Date().toISOString(),
        }),
        isCompleted: newTotal >= totalRequired,
      };

      if (newTotal >= totalRequired) {
        updateData.status = "مكتمل";
      }

      await updateDoc(postRef, updateData);

      // Send notification to donor
      const donorNotifRef = doc(
        db,
        "Notifications",
        donor.email,
        "user_Notifications",
        `${Date.now()}`
      );

      await setDoc(donorNotifRef, {
        title: "شكرًا على تبرعك",
        message: `لقد تبرعت بمبلغ ${donationAmount} جنيه للطلب ${postTitle}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: donor.uid,
      });

      // Send notification to recipient
      if (recipient.email) {
        const ownerNotifRef = doc(
          db,
          "Notifications",
          recipient.email,
          "user_Notifications",
          `${Date.now() + 1}`
        );

        await setDoc(ownerNotifRef, {
          title: "تم استلام تبرع جديد",
          message: `${donor.email} تبرع لك بمبلغ ${donationAmount} جنيه.`,
          timestamp: new Date().toISOString(),
          read: false,
          userId: recipient.id,
        });
      }

      // If donation target is reached, send completion notifications
      if (newTotal >= totalRequired) {
        const snapshot = await getDoc(postRef);
        const data = snapshot.data();

        const donorMap = (data?.donors || []).reduce((acc, d) => {
          if (d.email && !acc[d.email]) {
            acc[d.email] = d.uid || "unknown";
          }
          return acc;
        }, {});

        // Notify all donors about completion
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

        // Send QR code to recipient
        if (recipient.email) {
          const qrData = JSON.stringify({
            postId,
            title: postTitle,
            amount: totalRequired,
            totalDonated: newTotal,
            submittedBy: recipient,
          });

          const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            qrData
          )}&size=150x150`;

          const qrNotificationRef = doc(
            db,
            "Notifications",
            recipient.email,
            "user_Notifications",
            `${Date.now() + 2}`
          );

          await setDoc(qrNotificationRef, {
            title: "اكتمل جمع التبرعات 🎉",
            message: `تم اكتمال جمع التبرعات لطلبك "${postTitle}". هذا هو رمز الاستجابة السريعة الذي يحتوي على تفاصيل الطلب.`,
            imageUrl: qrCodeURL,
            timestamp: new Date().toISOString(),
            read: false,
            userId: recipient.id,
          });
        }
      }

    } catch (error) {
      // Silently log the error but don't show error to user since payment succeeded
      console.error("Database update error (payment was successful):", error);
    }

    // Always redirect to home after toast duration
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handlePaymentError = (error) => {
    toast.error(`خطأ في الدفع: ${error.message}`);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] py-8">
      <div className="payment-container" dir="rtl">
        {/* فورم الدفع */}
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-[var(--color-primary-base)] mb-6">
            أدخل بيانات الدفع
          </h2>

          <div className="form-row">
            <InputField
              label="الاسم الأول"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="الاسم الأول"
              required
            />
            <InputField
              label="اسم العائلة"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="اسم العائلة"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-[var(--color-primary-base)] font-medium">
              الدولة / المنطقة
            </label>
            <select 
              name="country" 
              value={form.country} 
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-1 bg-[var(--color-bg-base)] text-[var(--color-primary-base)] border-[var(--color-bg-divider)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)]"
            >
              <option value="مصر">مصر</option>
              <option value="الولايات المتحدة">الولايات المتحدة</option>
              <option value="المملكة المتحدة">المملكة المتحدة</option>
              <option value="الإمارات">الإمارات</option>
            </select>
          </div>

          <InputField
            label="الرقم الضريبي (اختياري)"
            id="vatId"
            name="vatId"
            value={form.vatId}
            onChange={handleChange}
            placeholder="أدخل الرقم الضريبي"
          />

          <SubmitButton buttonTitle="متابعة للدفع" />
        </form>

        {/* ملخص السلة */}
        <div className="cart-summary">
          <h2 className="text-xl font-bold text-[var(--color-primary-base)] mb-4">
            تبرع لحملة
          </h2>
          
          {donationData ? (
            <div className="space-y-3 mb-6">
              <div className="mb-4 p-3 bg-[var(--color-bg-base)] rounded-lg border border-[var(--color-bg-divider)]">
                <h4 className="font-medium text-[var(--color-primary-base)] mb-2">
                  {donationData.postTitle}
                </h4>
                <p className="text-sm text-[var(--color-bg-text-dark)] mb-2">
                  {donationData.postDetails}
                </p>
                <p className="text-xs text-[var(--color-bg-muted-text)]">
                  لصالح: {donationData.recipient.name}
                </p>
              </div>
              
              <div className="cart-row">
                <span className="text-[var(--color-bg-text-dark)]">مبلغ التبرع</span>
                <span className="text-[var(--color-primary-base)] font-medium">
                  {donationData.donationAmount.toLocaleString()} ج.م
                </span>
              </div>
              
              <hr className="border-[var(--color-bg-divider)]" />
              
              <div className="cart-row">
                <span className="text-xs text-[var(--color-bg-muted-text)]">
                  التقدم: {donationData.currentTotal.toLocaleString()} / {donationData.totalRequired.toLocaleString()} ج.م
                </span>
                <span className="text-xs text-[var(--color-bg-muted-text)]">
                  {Math.round((donationData.currentTotal / donationData.totalRequired) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <div className="cart-row">
                <span className="text-[var(--color-bg-text-dark)]">جاري التحميل...</span>
              </div>
            </div>
          )}
          
          <div className="cart-row total">
            <h3 className="text-lg font-bold text-[var(--color-primary-base)]">الإجمالي:</h3>
            <h3 className="text-lg font-bold text-[var(--color-primary-base)]">
              {donationData 
                ? donationData.donationAmount.toLocaleString()
                : "0"
              } ج.م
            </h3>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showPaymentModal && donationData && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            amount={donationData.donationAmount}
            currency="egp"
            customerInfo={{
              firstName: form.firstName,
              lastName: form.lastName,
              country: form.country,
            }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onClose={handleCloseModal}
          />
        </Elements>
      )}
    </div>
  );
}