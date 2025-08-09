import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import DynamicCardLayout from "../layouts/DynamicCardLayout";
import CardsLayout from "../layouts/CardsLayout";
import UserInfo from "../components/UserInfo";

export default function BeneficiaryProfile() {
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  const getStatusColor = (status) => {
    switch (status) {
      case "مقبول":
        return "bg-green-500";
      case "مرفوض":
        return "bg-red-500";
      case "قيد المراجعة":
        return "bg-yellow-500";
      case "مكتمل":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "Posts"),
      (querySnapshot) => {
        const mySubmittedPosts = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          if (postData.submittedBy?.email === userEmail) {
            mySubmittedPosts.push({
              id: doc.id,
              ...postData,
            });
          }
        });

        setMyPosts(mySubmittedPosts);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching user posts:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <PageLayout>
      <Header_Subheader
        h1="ملف الطلبات الخاصة بك"
        p="تعرف على طلباتك والمبالغ التي تم جمعها."
      />

      {/* {معلومات المستخدم} */}
      <UserInfo />

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />

      {isLoading ? (
        <Loader />
      ) : myPosts.length === 0 ? (
        <NoData h2="لم تقم بإنشاء أي طلب حتى الآن." />
      ) : (
        <CardsLayout colNum={4}>
          {myPosts.map((post) => {
            const totalReceived = post.donors?.reduce(
              (sum, d) => sum + Number(d.amount || 0),
              0
            ) || 0;

            return (
              <DynamicCardLayout
                key={post.id}
                title={post.title}
                status={post.status}>
                <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                  <p>
                    <strong>المبلغ المطلوب:</strong> {post.amount} ج.م
                  </p>
                  <p>
                    <strong>المبلغ المستلم:</strong>{" "}
                    <span className="text-[var(--color-primary-base)]">
                      {totalReceived} ج.م
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
    </PageLayout>
  );
}
