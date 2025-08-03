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
import ImageIcon from "../icons/ImageIcon";
import UserInfo from "../components/UserInfo";

export default function BeneficiaryProfile() {
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  useEffect(() => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "Posts"), (querySnapshot) => {
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
    });

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <PageLayout>
      <Header_Subheader
        h1="ملف الطبات الخاصة بك"
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
        <CardsLayout colNum={1} fixedCol={2}>
          {myPosts.map((post) => {
            const totalReceived = post.donors?.reduce(
              (sum, d) => sum + Number(d.amount || 0),
              0
            );

            return (
              <CardLayout key={post.id} title={post.title}>
                <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                  <p>
                    <strong>حالة الطلب:</strong> {post.status}
                  </p>
                  <p>
                    <strong>المبلغ المطلوب:</strong> {post.amount} ج.م
                  </p>
                  <p>
                    <strong>المبلغ المستلم:</strong>{" "}
                    <span className="text-[var(--color-primary-base)]">
                      {totalReceived} ج.م
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
