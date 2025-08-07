import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import CreatePostTrigger from "../components/CreatePostTrigger";
import CouponForm from "../components/CouponForm";
import NoData from "../components/NoData";
import CouponCard from "../components/CouponCard";
import CardsLayout from "../layouts/CardsLayout";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";

export default function Coupons() {
  const { role, loading } = useAuth();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [selectedType, setselectedType] = useState("الكل");

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
  const handleCloseForm = () => {
    setShowCouponForm(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Coupons"),
      (snapshot) => {
        const fetchedCoupons = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => {
            const aDate = new Date(a.createdAt?.seconds * 1000 || 0);
            const bDate = new Date(b.createdAt?.seconds * 1000 || 0);
            return bDate - aDate;
          })
          .filter((post) => post.status === "مقبول");

        setCoupons(fetchedCoupons);
        setLoadingCoupons(false);
      },
      (error) => {
        console.error("Error fetching Coupons:", error);
        setLoadingCoupons(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading || role === null) return null;

  return (
    <>
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

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 items-center justify-center">
        {" "}
        {categories.map((type) => {
          const isSelected = selectedType === type;

          return (
            <button
              key={type}
              onClick={() => setselectedType(type)}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full
          ${
            isSelected
              ? "bg-[var(--color-primary-base)] text-[var(--color-secondary-base)]"
              : "bg-[var(--color-secondary-base)] text-[var(--color-bg-muted-text)]"
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

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />

      {/* عرض الرسالة أو الكوبونات */}
      {loadingCoupons ? (
        <Loader />
      ) : coupons.length === 0 ? (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      ) : (
        <CardsLayout colNum={2}>
          {coupons
            .filter((coupon) =>
              selectedType === "الكل" ? true : coupon.type === selectedType
            )
            .map((coupon) => (
              <CouponCard key={coupon.id} newCoupon={coupon} />
            ))}
        </CardsLayout>
      )}
    </>
  );
}
