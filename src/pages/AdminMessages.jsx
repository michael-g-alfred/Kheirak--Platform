import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Loader from "../components/Loader";
import NoData from "../components/NoData";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const unreadCount = messages.filter((msg) => !msg.read).length;
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 2;

  useEffect(() => {
    const q = query(
      collection(db, "ContactMessages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // filter messages
  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // pagination
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // handle read messages
  const markAsRead = async (id) => {
    await updateDoc(doc(db, "ContactMessages", id), { read: true });
  };

  const markAsUnread = async (id) => {
    await updateDoc(doc(db, "ContactMessages", id), { read: false });
  };

  // handle delete messages
  const deleteMessage = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف الرسالة؟")) {
      await deleteDoc(doc(db, "ContactMessages", id));
    }
  };

  return (
    <PageLayout>
      <Header_Subheader
        h1={`رسائل الإدارة (${unreadCount} غير مقروءة)`}
        p="عرض جميع الرسائل الواردة من المستخدمين"
      />

      {/* search bar */}
      <input
        type="text"
        placeholder="🔍 ابحث في الرسائل..."
        className="border p-2 rounded w-full mb-4 text-right"
        dir="rtl"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <NoData h2="لا توجد رسائل حالياً" />
      ) : (
        <>
          <div className="space-y-4 mt-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 border rounded-lg shadow-sm ${
                  msg.read ? "bg-white" : "bg-yellow-50"
                }`}
              >
                <h3 className="font-bold text-lg">{msg.name}</h3>
                <p className="text-sm text-gray-500">{msg.email}</p>
                {msg.phone && <p>📞 {msg.phone}</p>}
                <p className="mt-2">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {msg.timestamp?.toDate().toLocaleString()}
                </p>

                {/*read/unread buttons */}
                <div className="flex gap-2 mt-3">
                  {!msg.read ? (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="text-green-500 text-lg"
                    >
                      ✅ تعليم كمقروء
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsUnread(msg.id)}
                      className="text-yellow-500 text-lg"
                    >
                      ✉️ تعليم كغير مقروء
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-red-500 text-lg"
                  >
                    🗑 حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination buttons */}
          <div className="flex gap-2 justify-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              السابق
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </>
      )}
    </PageLayout>
  );
}
