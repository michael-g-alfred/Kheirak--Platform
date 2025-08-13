import { useState } from "react";
import { db } from "../Firebase/Firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import { campaignsData } from "../store/campaignsData";
import CardsLayout from "../layouts/CardsLayout";
import SelectableCard from "../components/SelectableCard";
import CampaignItemCard from "../components/CampaignItemCard";
import ConfirmModal from "../components/ConfirmModal";

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, userName } = useAuth();

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const confirmPurchase = async () => {
    if (!selectedCampaign || !selectedCategory || !selectedItem) return;
    setIsLoading(true);
    try {
      const couponsCol = collection(db, "Coupons");
      const docRef = doc(couponsCol);

      const newCoupon = {
        id: docRef.id,
        title: `كوبون ${selectedItem.name}`,
        details: `حملة: ${selectedCampaign.type} • فئة: ${selectedCategory.name} • السعر: ${selectedItem.price} ج.م`,
        type: selectedCampaign.type,
        attachedFiles: selectedItem.image || "",
        stock: parseFloat(quantity),
        totalCouponUsed: 0,
        status: "قيد المراجعة",
        timestamp: serverTimestamp(),
        submittedBy: {
          userName: userName || currentUser?.email || "مستخدم",
          userId: currentUser?.uid || "anonymous",
          email: currentUser?.email || "unknown@kheirak",
          userPhoto: currentUser?.photoURL || "",
        },
        meta: {
          campaignId: selectedCampaign.id,
          campaignName: selectedCampaign.name,
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          price: selectedItem.price,
          buyerEmail: currentUser?.email || "unknown@kheirak",
        },
      };

      await setDoc(docRef, newCoupon);

      if (currentUser?.email) {
        await addDoc(
          collection(
            db,
            "Notifications",
            currentUser.email,
            "user_Notifications"
          ),
          {
            title: "تم إنشاء حملتك",
            message: `تم إنشاء حملة ${selectedItem.name} وهي الآن قيد المراجعة`,
            imageUrl: selectedItem.image || "",
            imageAlt: selectedItem.name,
            timestamp: Date.now(),
          }
        );
      }

      toast.success(`تم شراء ${selectedItem.name} بنجاح وهي الآن قيد المراجعة`);
      closePopup();
    } catch {
      toast.error("حدث خطأ أثناء العملية");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary-base)]">
        الحملات
      </h1>

      {/* حملات */}
      <CardsLayout>
        {campaignsData.map((campaign) => (
          <SelectableCard
            key={campaign.id}
            item={campaign}
            active={selectedCampaign?.id === campaign.id}
            onClick={() => {
              setSelectedCampaign(campaign);
              setSelectedCategory(null);
            }}>
            <div>نوع الحملة: {campaign.type}</div>
          </SelectableCard>
        ))}
      </CardsLayout>

      {/* فئات */}
      {selectedCampaign?.categories?.length > 0 && (
        <>
          <h3 className="mt-6 text-xl font-semibold text-[var(--color-primary-base)]">
            إختر فئة
          </h3>
          <CardsLayout>
            {selectedCampaign.categories.map((cat) => (
              <SelectableCard
                key={cat.id}
                item={cat}
                active={selectedCategory?.id === cat.id}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </CardsLayout>
        </>
      )}

      {/* عناصر */}
      {selectedCategory && (
        <>
          <h4 className="mt-6 text-md font-semibold text-[var(--color-primary-base)]">
            العناصر في {selectedCategory.name}:
          </h4>
          <CardsLayout>
            {selectedCategory.items.map((item) => (
              <CampaignItemCard
                key={item.id}
                item={item}
                onSelect={(i) => {
                  setSelectedItem(i);
                  setShowPopup(true);
                }}
              />
            ))}
          </CardsLayout>
        </>
      )}

      {/* مودال */}
      {showPopup && selectedItem && (
        <ConfirmModal
          title="تأكيد شراء كوبون"
          description={`سيتم شراء كوبون للعنصر: ${selectedItem.name}`}
          bulletPoints={[
            `عنوان الكوبون: كوبون ${selectedItem.name}`,
            `تفاصيل الكوبون: حملة ${selectedCampaign?.type} • فئة ${selectedCategory?.name} • السعر: ${selectedItem.price} ج.م`,
            `سعر الكوبون: ${selectedItem.price} جنيه`,
          ]}
          showInput={true}
          inputProps={{
            value: quantity,
            onChange: (e) => setQuantity(Number(e.target.value)),
            type: "number",
            placeholder: "أدخل الكمية",
            min: 1,
          }}
          warningText="يرجى التأكد من صحة البيانات قبل التأكيد."
          confirmText="تأكيد"
          cancelText="إغلاق"
          onConfirm={confirmPurchase}
          onClose={closePopup}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
