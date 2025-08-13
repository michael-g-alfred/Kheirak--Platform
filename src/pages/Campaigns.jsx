
import React, { useState } from "react";
import { db } from "../Firebase/Firebase";
import { collection, doc, setDoc, serverTimestamp, addDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import { campaignsData } from "../store/campaignsData"; // استيراد البيانات من الملف الخارجي

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { currentUser, userName } = useAuth();

  const confirmPurchase = async () => {
    if (!selectedCampaign || !selectedRestaurant || !selectedMeal) return;

    try {
      const couponsCol = collection(db, "Coupons");
      const docRef = doc(couponsCol);

      const newCoupon = {
        id: docRef.id,
        title: `كوبون ${selectedMeal.name}`,
        details: `حملة: ${selectedCampaign.type} • مطعم: ${selectedRestaurant.name} • السعر: ${selectedMeal.price} ج.م`,
        type: "إطعام",
        attachedFiles: selectedMeal.image || "",
        stock: 1,
        totalCouponUsed: 0,
        status: "مقبول",
        timestamp: serverTimestamp(),
        submittedBy: {
          userName: userName || currentUser?.email || "مستخدم",
          userId: currentUser?.uid || "anonymous",
          email: currentUser?.email || "unknown@kheirak",
          userPhoto: currentUser?.photoURL || "",
        },
        beneficiaries: [],
        meta: {
          campaignId: selectedCampaign.id,
          campaignName: selectedCampaign.name,
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          mealId: selectedMeal.id,
          mealName: selectedMeal.name,
          price: selectedMeal.price,
          buyerEmail: currentUser?.email || "unknown@kheirak",
        },
      };

      await setDoc(docRef, newCoupon);

      if (currentUser?.email) {
        const notifCol = collection(db, "Notifications", currentUser.email, "user_Notifications");
        await addDoc(notifCol, {
          title: "تم إنشاء حملتك",
          message: `تم إنشاء حملة ${selectedMeal.name} وهي الآن قيد المراجعة`,
          imageUrl: selectedMeal.image || "",
          imageAlt: selectedMeal.name,
          timestamp: Date.now(),
        });
      }

      toast.success(`تم شراء ${selectedMeal.name} وإضافة الإشعار بنجاح`);
      setSelectedMeal(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء العملية");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>الحملات</h1>

      {campaignsData.map((campaign) => (
        <button
          key={campaign.id}
          onClick={() => {
            setSelectedCampaign(campaign);
            setSelectedRestaurant(null);
          }}
          style={{
            display: "block",
            margin: "10px 0",
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {campaign.name}
        </button>
      ))}

      {selectedCampaign && selectedCampaign.restaurants.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2>نوع الحملة: {selectedCampaign.type}</h2>
          <h3>اختر مطعم:</h3>
          {selectedCampaign.restaurants.map((rest) => (
            <button
              key={rest.id}
              onClick={() => setSelectedRestaurant(rest)}
              style={{
                display: "block",
                margin: "8px 0",
                padding: "8px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {rest.name}
            </button>
          ))}
        </div>
      )}

      {selectedRestaurant && (
        <div style={{ marginTop: 20 }}>
          <h3>الوجبات في {selectedRestaurant.name}:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedRestaurant.meals.map((meal) => (
              <li key={meal.id} style={{ marginBottom: "10px" }}>
                {meal.name} - {meal.price} جنيه
                <button
                  onClick={() => setSelectedMeal(meal)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    background: "#FF5722",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  تفاصيل
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedMeal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <img
              src={selectedMeal.image}
              alt={selectedMeal.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h2>{selectedMeal.name}</h2>
            <p>{selectedMeal.description}</p>
            <p>السعر: {selectedMeal.price} جنيه</p>
            <button
              onClick={confirmPurchase}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              تأكيد
            </button>
            <button
              onClick={() => setSelectedMeal(null)}
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                padding: "8px 15px",
                background: "#ccc",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


