import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import { campaignsData } from "../data/campaignsData";
import CardsLayout from "../layouts/CardsLayout";
import SelectableCard from "../components/SelectableCard";
import CampaignItemCard from "../components/CampaignItemCard";
import ConfirmModal from "../components/ConfirmModal";

// Constants
const DEFAULT_QUANTITY = 1;
const FALLBACK_EMAIL = "unknown@kheirak";
const FALLBACK_USER_NAME = "مستخدم";
const FALLBACK_USER_ID = "anonymous";

export default function Campaigns() {
  // State
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);
  const [showModal, setShowModal] = useState(false);

  // Hooks
  const { currentUser, userName } = useAuth();
  const navigate = useNavigate();

  // Computed values
  const totalAmount = useMemo(() => {
    return selectedItem ? selectedItem.price * quantity : 0;
  }, [selectedItem, quantity]);

  const isValidSelection = useMemo(() => {
    return selectedCampaign && selectedCategory && selectedItem;
  }, [selectedCampaign, selectedCategory, selectedItem]);

  // Utility functions
  const preparePaymentData = useCallback(() => {
    if (!isValidSelection) return null;

    return {
      // Payment component expects these specific properties
      postId: `campaign_${selectedCampaign.id}_${selectedItem.id}`,
      postTitle: `كوبون ${selectedItem.name}`,
      postDetails: `حملة: ${selectedCampaign.type} • فئة: ${selectedCategory.name} • السعر: ${selectedItem.price} ج.م`,
      donationAmount: totalAmount,
      currentTotal: 0, // For campaigns, we start from 0
      totalRequired: totalAmount, // For campaigns, total required equals the amount being paid
      donor: {
        email: currentUser?.email || FALLBACK_EMAIL,
        uid: currentUser?.uid || FALLBACK_USER_ID,
        name: userName || currentUser?.email || FALLBACK_USER_NAME,
      },
      recipient: {
        id: selectedCampaign.id,
        email: FALLBACK_EMAIL, // For campaigns, we can use a default
        name: selectedCampaign.name || selectedCampaign.type,
      },
      // Additional campaign-specific data
      campaignData: {
        type: 'campaign',
        title: `كوبون ${selectedItem.name}`,
        details: `حملة: ${selectedCampaign.type} • فئة: ${selectedCategory.name} • السعر: ${selectedItem.price} ج.م`,
        campaignType: selectedCampaign.type,
        attachedFiles: selectedItem.image || "",
        quantity: parseFloat(quantity),
        price: selectedItem.price,
        totalAmount,
        meta: {
          campaignId: selectedCampaign.id,
          campaignName: selectedCampaign.name,
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          price: selectedItem.price,
          buyerEmail: currentUser?.email || FALLBACK_EMAIL,
        },
        submittedBy: {
          userName: userName || currentUser?.email || FALLBACK_USER_NAME,
          userId: currentUser?.uid || FALLBACK_USER_ID,
          email: currentUser?.email || FALLBACK_EMAIL,
          userPhoto: currentUser?.photoURL || "",
        }
      }
    };
  }, [
    isValidSelection,
    selectedItem,
    selectedCampaign,
    selectedCategory,
    quantity,
    totalAmount,
    currentUser,
    userName
  ]);

  // Event handlers
  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCategory(null);
    setSelectedItem(null);
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  }, []);

  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
    setShowModal(true);
  }, []);

  const handleQuantityChange = useCallback((e) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedItem(null);
    setQuantity(DEFAULT_QUANTITY);
  }, []);

  const handleConfirmPurchase = useCallback(() => {
    if (!isValidSelection) {
      toast.error("يرجى التأكد من اختيار جميع البيانات المطلوبة");
      return;
    }

    const paymentData = preparePaymentData();
    if (!paymentData) {
      toast.error("حدث خطأ في إعداد بيانات الدفع");
      return;
    }

    navigate('/payment', { state: { donationData: paymentData } });
    closeModal();
  }, [isValidSelection, preparePaymentData, navigate, closeModal]);

  // Modal configuration
  const modalConfig = useMemo(() => {
    if (!selectedItem) return null;

    return {
      title: "تأكيد شراء كوبون",
      description: `سيتم الانتقال إلى صفحة الدفع لشراء كوبون: ${selectedItem.name}`,
      bulletPoints: [
        `عنوان الكوبون: كوبون ${selectedItem.name}`,
        `تفاصيل الكوبون: حملة ${selectedCampaign?.type} • فئة ${selectedCategory?.name} • السعر: ${selectedItem.price} ج.م`,
        `سعر الكوبون: ${selectedItem.price} جنيه`,
        `إجمالي المبلغ: ${totalAmount} جنيه`,
      ],
      inputProps: {
        value: quantity,
        onChange: handleQuantityChange,
        type: "number",
        placeholder: "أدخل الكمية",
        min: 1,
      },
      warningText: "سيتم تحويلك إلى صفحة الدفع لإكمال عملية الشراء.",
      confirmText: "الانتقال للدفع",
      cancelText: "إغلاق",
    };
  }, [selectedItem, selectedCampaign, selectedCategory, totalAmount, quantity, handleQuantityChange]);

  // Render sections
  const renderCampaignSection = () => (
    <section>
      <h1 className="text-3xl font-bold text-[var(--color-primary-base)] mb-6">
        الحملات
      </h1>
      <CardsLayout>
        {campaignsData.map((campaign) => (
          <SelectableCard
            key={campaign.id}
            item={campaign}
            active={selectedCampaign?.id === campaign.id}
            onClick={() => handleCampaignSelect(campaign)}
          >
            <div>نوع الحملة: {campaign.type}</div>
          </SelectableCard>
        ))}
      </CardsLayout>
    </section>
  );

  const renderCategorySection = () => {
    if (!selectedCampaign?.categories?.length) return null;

    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[var(--color-primary-base)] mb-4">
          إختر فئة
        </h2>
        <CardsLayout>
          {selectedCampaign.categories.map((category) => (
            <SelectableCard
              key={category.id}
              item={category}
              active={selectedCategory?.id === category.id}
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </CardsLayout>
      </section>
    );
  };

  const renderItemsSection = () => {
    if (!selectedCategory) return null;

    return (
      <section className="mt-8">
        <h3 className="text-lg font-semibold text-[var(--color-primary-base)] mb-4">
          العناصر في {selectedCategory.name}:
        </h3>
        <CardsLayout>
          {selectedCategory.items.map((item) => (
            <CampaignItemCard
              key={item.id}
              item={item}
              onSelect={handleItemSelect}
            />
          ))}
        </CardsLayout>
      </section>
    );
  };

  const renderModal = () => {
    if (!showModal || !selectedItem || !modalConfig) return null;

    return (
      <ConfirmModal
        {...modalConfig}
        showInput={true}
        onConfirm={handleConfirmPurchase}
        onClose={closeModal}
        isLoading={false}
      />
    );
  };

  return (
    <div className="px-6 space-y-8">
      {renderCampaignSection()}
      {renderCategorySection()}
      {renderItemsSection()}
      {renderModal()}
    </div>
  );
}
