//import React from "react";

/*export default function DonorProfile() {
  return <div>DonorProfile</div>;
}*/


import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

export default function DonorProfile() {
  const [donatedPosts, setDonatedPosts] = useState([]);
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Posts"));
        const postsWithDonations = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const donors = postData.donors || [];

          console.log("Post:", postData.requestTitle); // was 'title'
          console.log("Donors:", donors);

          const donated = donors.some((donor) => donor.email === userEmail);

          if (donated) {
            postsWithDonations.push({
              id: doc.id,
              ...postData,
            });
          }
        });

        console.log("Posts With Donations:", postsWithDonations);
        setDonatedPosts(postsWithDonations);
      } catch (error) {
        console.error("Error fetching donated posts:", error);
      }
    };

    if (userEmail) {
      fetchPosts();
    }
  }, [userEmail]);

  return (
    <div>
      <h2>البوستات التي تبرعت عليها</h2>
      {donatedPosts.length === 0 ? (
        <p>لم تقم بأي تبرع حتى الآن.</p>
      ) : (
        <ul>
          {donatedPosts.map((post) => (
            <li key={post.id}>
              <h4>{post.requestTitle}</h4>
              <p>
                المبلغ المتبرع به:{" "}
                {
                  post.donors.find((d) => d.email === userEmail)?.amount
                }{" "}
                ج.م
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


