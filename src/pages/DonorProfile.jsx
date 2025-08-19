import { useAuth } from "../context/authContext";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import Divider from "../components/Divider";
import DynamicCardLayout from "../layouts/DynamicCardLayout";
import CardsLayout from "../layouts/CardsLayout";
import UserInfo from "../components/UserInfo";
import { getStatusColor } from "../utils/statusUtils";
import { useFetchCollection } from "../hooks/useFetchCollection";

export default function DonorProfile() {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  // Donated posts
  const { data: donatedPosts, isLoading: loadingPosts } = useFetchCollection(
    ["Posts"],
    (post) => post.donors?.some((donor) => donor.email === userEmail),
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // User coupons
  const { data: userCoupons, isLoading } = useFetchCollection(
    ["Coupons"],
    (coupon) => coupon?.submittedBy?.email === userEmail,
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <PageLayout>
      <Header_Subheader
        h1="ملف التبرعات الخاص بك"
        p="تعرف على الطلبات التي ساهمت فيها ومقدار تبرعاتك."
      />

      <UserInfo />

      <Divider />

      {/* Donated Posts Section */}
      {isLoading ? (
        <Loader />
      ) : donatedPosts.length === 0 ? (
        <NoData h2="لم تقم بأي تبرع حتى الآن." />
      ) : (
        <CardsLayout colNum={4}>
          {donatedPosts.map((post) => {
            const totalDonated = (post.donors || [])
              .filter((d) => d.email === userEmail)
              .reduce((sum, d) => sum + Number(d.amount || 0), 0);

            return (
              <DynamicCardLayout
                key={post.id}
                title={post.title}
                status={post.status}>
                <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                  <p>
                    <strong>الجهة:</strong>{" "}
                    {post.submittedBy?.userName || "غير محدد"}
                  </p>
                  <p>
                    <strong>نوع الطلب:</strong> {post.type || "غير محدد"}
                  </p>
                  <p>
                    <strong>المبلغ المتبرع به:</strong>{" "}
                    <span className="text-[var(--color-primary-base)]">
                      {totalDonated} ج.م
                    </span>
                  </p>
                  <p className="mt-4 w-full">
                    <strong>الحالة: </strong>
                    <span
                      className={`${getStatusColor(
                        post.status
                      )} w-full font-bold py-0.125 px-2 rounded`}>
                      {post.status}
                    </span>
                  </p>
                </div>
              </DynamicCardLayout>
            );
          })}
        </CardsLayout>
      )}

      <Divider />

      {/* User Coupons Section */}
      {isLoading ? (
        <Loader />
      ) : userCoupons.length === 0 ? (
        <NoData h2="لم تقم بشراء أي كوبونات حتى الآن." />
      ) : (
        <CardsLayout colNum={4}>
          {userCoupons.map((coupon) => (
            <DynamicCardLayout
              key={coupon.id}
              title={coupon.title}
              status={coupon.status}>
              <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                <p>
                  <strong>تفاصيل الكوبون:</strong>{" "}
                  {coupon.details || "غير متوفر"}
                </p>
                <p>
                  <strong>عدد الكوبونات الكلي:</strong> {coupon.stock}
                </p>
                <p>
                  <strong>عدد المستخدم منها:</strong>{" "}
                  {coupon.totalCouponUsed || 0}
                </p>
                <p>
                  <strong>عدد المتبقي:</strong>{" "}
                  {(coupon.stock || 0) - (coupon.totalCouponUsed || 0)}
                </p>
                <p className="mt-4 w-full">
                  <strong>الحالة: </strong>
                  <span
                    className={`${getStatusColor(
                      coupon.status
                    )} w-full font-bold py-0.125 px-2 rounded`}>
                    {coupon.status}
                  </span>
                </p>
              </div>
            </DynamicCardLayout>
          ))}
        </CardsLayout>
      )}
    </PageLayout>
  );
}
