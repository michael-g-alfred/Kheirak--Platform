const handleConfirmDonation = async () => {
  setShowPopup(false);
  toast.loading("جاري تنفيذ استخدام الكوبون...");
  setIsLoading(true);
  const newTotal = totalCouponUsed + 1;

  try {
    const { doc, updateDoc, arrayUnion, getDoc, setDoc } = await import(
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
      title: "كوبون مستخدم",
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
        title: "تم استخدام كوبون",
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
          title: "اكتمل استخدام الكوبون",
          message: `تم استخدام جميع كوبونات "${data.title}" بنجاح.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }
  } catch (error) {
    toast.dismiss();
    toast.error("حدث خطأ أثناء استخدام الكوبون.");
  }

  setIsLoading(false);
};
