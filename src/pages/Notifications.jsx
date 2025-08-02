/*export default function Notifications() {
  return <div>Notifications</div>;
}*/
/*import { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const notifRef = collection(db, "notifications", user.email, "user_notifications");
    const unsubscribe = onSnapshot(notifRef, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h2> الإشعارات</h2>
      {notifications.length === 0 ? (
        <p>لا توجد إشعارات</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              <h4>{notif.title}</h4>
              <p>{notif.message}</p>
              <small>{new Date(notif.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}*/
import { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const notifRef = collection(db, "notifications", userEmail, "user_notifications");
    const unsubscribe = onSnapshot(notifRef, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(
        notifs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      );
    });

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <div>
      <h2>الإشعارات</h2>
      {notifications.length === 0 ? (
        <p>لا توجد إشعارات</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              <h4>{notif.title}</h4>
              <p>{notif.message}</p>
              <small>{new Date(notif.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


