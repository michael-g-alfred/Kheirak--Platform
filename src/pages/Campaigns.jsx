import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { campaignsData } from "../data/campaignsData";
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
  const { currentUser, userName } = useAuth();
  const navigate = useNavigate();

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const confirmPurchase = () => {
    if (!selectedCampaign || !selectedCategory || !selectedItem) return;

    // Calculate total amount based on item price and quantity
    const totalAmount = selectedItem.price * quantity;

    // Prepare coupon data to be created after successful payment
    const couponData = {
      title: `كوبون ${selectedItem.name}`,
      details: `حملة: ${selectedCampaign.type} • فئة: ${selectedCategory.name} • السعر: ${selectedItem.price} ج.م`,
      type: selectedCampaign.type,
      attachedFiles: selectedItem.image || "",
      stock: parseFloat(quantity),
      totalCouponUsed: 0,
      status: "مقبول",
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

    // Prepare donation data for payment page
    const donationData = {
      donationAmount: totalAmount,
      donationType: "campaign_coupon",
      campaignInfo: {
        campaign: selectedCampaign,
        category: selectedCategory,
        item: selectedItem,
        quantity: quantity,
      },
      couponData: couponData,
    };

    // Close the modal
    closePopup();

    // Navigate to payment page with the donation data
    navigate("/payment", {
      state: {
        donationData: donationData,
      },
    });
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
          title={`تأكيد شراء كوبون - بقيمة ${selectedItem.price * quantity} جنيه`}
          description={`سيتم شراء كوبون للعنصر: ${selectedItem.name}`}
          bulletPoints={[
            `عنوان الكوبون: كوبون ${selectedItem.name}`,
            `تفاصيل الكوبون: حملة ${selectedCampaign?.type} • فئة ${selectedCategory?.name} • السعر: ${selectedItem.price} ج.م`,
            `سعر الكوبون: ${
              selectedItem.price * quantity
            } جنيه (${quantity} × ${selectedItem.price})`,
          ]}
          showInput={true}
          inputProps={{
            value: quantity,
            onChange: (e) => setQuantity(Number(e.target.value)),
            type: "number",
            placeholder: "أدخل الكمية",
            min: 1,
          }}
          warningText="سيتم توجيهك إلى صفحة الدفع لإتمام عملية الشراء."
          confirmText="متابعة للدفع"
          cancelText="إغلاق"
          onConfirm={confirmPurchase}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
