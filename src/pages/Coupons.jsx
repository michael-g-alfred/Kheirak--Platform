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
      {/* عرض الرسالة أو الكوبونات */}
      {loadingCoupons ? (
        <Loader />
      ) : coupons.length === 0 ? (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      ) : (
        <CardsLayout colNum={2}>
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} newCoupon={coupon} />
          ))}
        </CardsLayout>
      )}
    </>
  );
}
