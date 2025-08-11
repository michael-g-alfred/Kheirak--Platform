import { useState } from "react";
import { useFetchCollection } from "../hooks/useFetchCollection";
import CreatePostTrigger from "../components/CreatePostTrigger";
import CouponForm from "../components/CouponForm";
import NoData from "../components/NoData";
import CouponCard from "../components/CouponCard";
import CardsLayout from "../layouts/CardsLayout";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";
import Divider from "../components/Divider";
import { toast } from "react-hot-toast";

export default function Coupons() {
  const { role, loading } = useAuth();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [selectedType, setSelectedType] = useState("الكل");

  const categories = [
    "الكل",
    "طعام",
    "دواء",
    "ملابس",
    "كهرباء",
    "خدمات",
    "تعليم",
  ];
  const categoryIcons = {
    الكل: "📦",
    طعام: "🍔",
    دواء: "💊",
    ملابس: "👕",
    كهرباء: "💡",
    خدمات: "🛠️",
    تعليم: "🎓",
  };

  const filterFn = (coupon) => coupon.status === "مقبول";

  const sortFn = (a, b) => {
    const aDate = new Date(a.createdAt?.seconds * 1000 || 0);
    const bDate = new Date(b.createdAt?.seconds * 1000 || 0);
    return bDate - aDate;
  };

  const {
    data: Coupons,
    loading: loadingCoupons,
    error,
  } = useFetchCollection(["Coupons"], filterFn, sortFn);

  const handleCloseForm = () => {
    setShowCouponForm(false);
  };

  if (loading || role === null) return null;

  if (error) {
    toast.error("خطأ في جلب الكوبونات");
  }

  return (
    <div className="px-6">
      {role === "مؤسسة" && (
        <CreatePostTrigger
          title="إنشاء كوبون جديد"
          onClick={() => setShowCouponForm((prev) => !prev)}
        />
      )}
      {showCouponForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <CouponForm onClose={handleCloseForm} />
        </div>
      )}
      <Divider />
      {Coupons.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 items-center justify-center">
          {categories.map((type) => {
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full
          ${
            isSelected
              ? "bg-[var(--color-primary-base)] text-[var(--color-bg-text)]"
              : "bg-[var(--color-primary-disabled)] text-[var(--color-bg-muted-text)]"
          }`}>
                <span className="text-lg">{categoryIcons[type]}</span>
                <span
                  className={`text-md ${
                    isSelected ? "font-bold" : "font-medium"
                  }`}>
                  {type}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {Coupons.length > 0 && <Divider />}

      {loadingCoupons ? (
        <Loader />
      ) : Coupons.length === 0 ? (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      ) : (
        <CardsLayout>
          {Coupons.filter((coupon) =>
            selectedType === "الكل" ? true : coupon.type === selectedType
          ).map((coupon) => (
            <CouponCard key={coupon.id} newCoupon={coupon} />
          ))}
        </CardsLayout>
      )}
    </div>
  );
}
