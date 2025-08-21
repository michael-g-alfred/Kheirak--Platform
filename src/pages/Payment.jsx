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
  setDoc,
  collection,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import PaymentModal from "../components/PaymentModal";
import PageLayout from "../layouts/PageLayout";
import FormLayout from "../layouts/FormLayout";
import Loader from "../components/Loader";
import Divider from "../components/Divider";

// Initialize Stripe
// To use this, create a .env file in your project root and add:
// VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
const stripePublishableKey =
  "pk_test_51Rw3aJKqx1jQOopCOqMxQzaDYgoO4cgAyhjElDvwD5a3iHZ87MW3o54apgr5qpgtPNWVRgBhAlPR92Fph6X8dhGX00DBTr4ltD";
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

    // Check if this is a campaign coupon purchase
    if (donationData.donationType === "campaign_coupon") {
      // Handle campaign coupon purchase
      await handleCampaignCouponPurchase();
    } else {
      // Handle regular donation
      await handleRegularDonation();
    }
  };

  const handleCampaignCouponPurchase = async () => {
    // Show success message for coupon purchase
    toast.dismiss();
    toast.success(
      `تم شراء الكوبون بنجاح! دفعت ${donationData.donationAmount} ج.م`,
      {
        duration: 3000,
      }
    );

    // Try to create coupon in database
    try {
      const couponsCol = collection(db, "Coupons");
      const docRef = doc(couponsCol);

      const newCoupon = {
        id: docRef.id,
        ...donationData.couponData,
        timestamp: serverTimestamp(),
      };

      await setDoc(docRef, newCoupon);

      // Send notification to user about coupon creation
      if (
        donationData.couponData.submittedBy.email &&
        donationData.couponData.submittedBy.email !== "unknown@kheirak"
      ) {
        await addDoc(
          collection(
            db,
            "Notifications",
            donationData.couponData.submittedBy.email,
            "user_Notifications"
          ),
          {
            title: "تم إنشاء كوبونك",
            message: `تم إنشاء كوبون ${donationData.campaignInfo.item.name} وهو الآن قيد المراجعة`,
            imageUrl: donationData.campaignInfo.item.image || "",
            imageAlt: donationData.campaignInfo.item.name,
            timestamp: Date.now(),
          }
        );
      }
    } catch (error) {
      console.error("Database update error (payment was successful):", error);
      toast.error(
        "تم الدفع بنجاح ولكن حدث خطأ في إنشاء الكوبون. يرجى التواصل مع الدعم."
      );
    }
  };

  const handleRegularDonation = async () => {
    // Show success message for regular donation
    toast.dismiss();
    toast.success(
      ` تم الدفع والتبرع بنجاح! تبرعت بـ ${donationData.donationAmount} ج.م`,
      {
        duration: 3000,
      }
    );

    // Try to update database in the background
    try {
      const {
        postId,
        donationAmount,
        totalRequired,
        currentTotal,
        donor,
        recipient,
        postTitle,
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
  };

  const handlePaymentError = (error) => {
    toast.error(`خطأ في الدفع: ${error.message}`);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <PageLayout>
      {/* فورم الدفع وملخص السلة في شبكة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <FormLayout formTitle={"أدخل بيانات الدفع"}>
          <form className="space-y-2" onSubmit={handleSubmit}>
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
            <InputField
              label="الدولة / المنطقة"
              id="country"
              name="country"
              select={true}
              value={form.country}
              onChange={handleChange}
              options={[
                { label: "مصر", value: "مصر" },
                { label: "الولايات المتحدة", value: "الولايات المتحدة" },
                { label: "المملكة المتحدة", value: "المملكة المتحدة" },
                { label: "الإمارات", value: "الإمارات" },
              ]}
            />

            <SubmitButton buttonTitle="متابعة للدفع" />
          </form>
        </FormLayout>

        <FormLayout
          formTitle={
            donationData?.donationType === "campaign_coupon"
              ? "شراء كوبون"
              : "تبرع لحملة"
          }>
          {donationData ? (
            <div className="space-y-3 mb-6">
              {donationData.donationType === "campaign_coupon" ? (
                // Campaign coupon summary
                <div className="mb-4 p-3 rounded-lg border border-[var(--color-bg-divider)]">
                  <h4 className="font-medium text-[var(--color-primary-base)] mb-2">
                    كوبون {donationData.campaignInfo.item.name}
                  </h4>
                  <div className="text-sm text-[var(--color-bg-text-dark)] mb-2 space-y-1">
                    <p>حملة: {donationData.campaignInfo.campaign.type}</p>
                    <p>فئة: {donationData.campaignInfo.category.name}</p>
                    <p>العنصر: {donationData.campaignInfo.item.name}</p>
                  </div>
                </div>
              ) : (
                // Regular donation summary
                <div className="mb-4 p-3 bg-[var(--color-bg-base)] rounded-lg border border-[var(--color-bg-divider)]">
                  <h4 className="font-medium text-[var(--color-primary-base)] mb-2">
                    {donationData.postTitle}
                  </h4>
                  <div className="text-sm text-[var(--color-bg-text-dark)] mb-2 space-y-1">
                    {donationData.postDetails ? (
                      donationData.postDetails
                        .split("•")
                        .map((detail, index) => (
                          <p key={index} className="leading-relaxed">
                            {detail.trim()}
                          </p>
                        ))
                    ) : (
                      <p>غير معرف</p>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-bg-muted-text)]">
                    لصالح: {donationData.recipient.name}
                  </p>
                </div>
              )}
              <Divider />

              {/* Show quantity and unit price for campaign coupons */}
              {donationData.donationType === "campaign_coupon" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-bg-text-dark)]">
                      الكمية
                    </span>
                    <span className="text-[var(--color-primary-base)] font-medium">
                      {donationData.campaignInfo.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[var(--color-bg-text-dark)]">
                      سعر الكوبون الواحد
                    </span>
                    <span className="text-[var(--color-primary-base)] font-medium">
                      {donationData.campaignInfo.item.price.toLocaleString()}{" "}
                      ج.م
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-bg-text-dark)]">
                      {donationData.donationType === "campaign_coupon"
                        ? "إجمالي المبلغ"
                        : "مبلغ التبرع"}
                    </span>
                    <span className="text-[var(--color-primary-base)] font-medium">
                      {donationData.donationAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Loader />
          )}

          <Divider />

          <div className="flex justify-between">
            <h3 className="text-lg font-bold text-[var(--color-primary-base)]">
              الإجمالي:
            </h3>
            <h3 className="text-lg font-bold text-[var(--color-primary-base)]">
              {donationData
                ? donationData.donationAmount.toLocaleString()
                : "0"}{" "}
              ج.م
            </h3>
          </div>
        </FormLayout>
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
    </PageLayout>
  );
}
