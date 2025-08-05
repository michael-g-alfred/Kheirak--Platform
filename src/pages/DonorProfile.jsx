import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import CardLayout from "../layouts/CardLayout";
import CardsLayout from "../layouts/CardsLayout";
import UserInfo from "../components/UserInfo";

export default function DonorProfile() {
  const [donatedPosts, setDonatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  useEffect(() => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "Posts"), (querySnapshot) => {
      const postsWithDonations = [];

      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        const donors = postData.donors || [];
        const donated = donors.some((donor) => donor.email === userEmail);

        if (donated) {
          postsWithDonations.push({
            id: doc.id,
            ...postData,
          });
        }
      });

      setDonatedPosts(postsWithDonations);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <PageLayout>
      <Header_Subheader
        h1="ملف التبرعات الخاص بك"
        p="تعرف على الطلبات التي ساهمت فيها ومقدار تبرعاتك."
      />

      {/* {معلومات المستخدم} */}
      <UserInfo />

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />

      {isLoading ? (
        <Loader />
      ) : donatedPosts.length === 0 ? (
        <NoData h2="لم تقم بأي تبرع حتى الآن." />
      ) : (
        <CardsLayout colNum={1} fixedCol={2}>
          {donatedPosts.map((post) => {
            const totalDonated = post.donors
              .filter((d) => d.email === userEmail)
              .reduce((sum, d) => sum + Number(d.amount || 0), 0);

            return (
              <CardLayout key={post.id} title={post.title}>
                <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                  <p>
                    <strong>صاحب الطلب:</strong> {post.submittedBy.userName}
                  </p>
                  <p>
                    <strong>حالة الطلب:</strong> {post.status}
                  </p>
                  <p>
                    <strong>المبلغ المتبرع به:</strong>{" "}
                    <span className="text-[var(--color-primary-base)]">
                      {totalDonated} ج.م
                    </span>
                  </p>
                </div>
              </CardLayout>
            );
          })}
        </CardsLayout>
      )}
    </PageLayout>
  );
}
