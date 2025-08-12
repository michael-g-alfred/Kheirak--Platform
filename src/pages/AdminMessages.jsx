import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import { useState } from "react";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import Searchbar from "../components/Searchbar";
import TrashIcon from "../icons/TrashIcon";
import MailIcon from "../icons/MailIcon";
import PhoneIcon from "../icons/PhoneIcon";
import { useFetchCollection } from "../hooks/useFetchCollection";
import { toast } from "react-hot-toast";
import { usePagination } from "../hooks/usePagination";
import EyeIcon from "../icons/EyeIcon";
import EyeOffIcon from "../icons/EyeOffIcon";
import CardsLayout from "../layouts/CardsLayout";
import CardLayout from "../layouts/CardLayout";
import CommentIcon from "../icons/CommentIcon";
import PaginationControls from "../components/PaginationControls";
import { db } from "../Firebase/Firebase";

export default function AdminMessages() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: messages,
    loading,
    error,
  } = useFetchCollection(
    ["ContactMessages"],
    null,
    (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
  );

  const unreadCount = messages.filter((msg) => !msg.read).length;

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    currentData: currentMessages,
    nextPage,
    prevPage,
  } = usePagination(filteredMessages);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "ContactMessages", id), { read: true });
      toast.success("تم تعليم الرسالة كمقروءة");
    } catch {
      toast.error("حدث خطأ أثناء تحديث الرسالة");
    }
  };

  const markAsUnread = async (id) => {
    try {
      await updateDoc(doc(db, "ContactMessages", id), { read: false });
      toast.success("تم تعليم الرسالة كغير مقروءة");
    } catch {
      toast.error("حدث خطأ أثناء تحديث الرسالة");
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف الرسالة؟")) {
      try {
        await deleteDoc(doc(db, "ContactMessages", id));
        toast.success("تم حذف الرسالة بنجاح");
      } catch {
        toast.error("حدث خطأ أثناء حذف الرسالة");
      }
    }
  };

  return (
    <PageLayout>
      <Header_Subheader
        h1={`رسائل الإدارة (${unreadCount} غير مقروءة)`}
        p="عرض جميع الرسائل الواردة من المستخدمين"
      />

      <Searchbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="ابحث في الرسائل..."
      />

      {loading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <NoData h2="لا توجد رسائل حالياً" />
      ) : (
        <>
          <CardsLayout colNum={2} smEnabled={false}>
            {currentMessages.map((msg) => (
              <CardLayout
                key={msg.id}
                title={
                  <div className="flex items-center gap-2">
                    {msg.name}
                    {!msg.read && (
                      <span className="text-xs bg-[var(--color-warning-light)]  text-[var(--color-bg-text)] px-3 py-1 rounded">
                        غير مقروء
                      </span>
                    )}
                  </div>
                }
                className={
                  !msg.read ? "bg-yellow-50 border-l-4 border-yellow-400" : ""
                }>
                {msg.email && (
                  <p className="flex items-center gap-2">
                    <MailIcon /> {msg.email}
                  </p>
                )}
                {msg.phone && (
                  <p className="flex items-center gap-2">
                    <PhoneIcon /> {msg.phone}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <CommentIcon />
                  {msg.message}
                </p>
                <p className="text-xs text-[var(--color-bg-muted-text)] mt-2">
                  {msg.timestamp
                    ? new Date(msg.timestamp.toDate()).toLocaleString("ar-EG")
                    : ""}
                </p>
                <div className="flex gap-2 mt-3">
                  {!msg.read ? (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="text-[var(--color-success-light)]">
                      <EyeIcon />
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsUnread(msg.id)}
                      className="text-[var(--color-warning-light)]">
                      <EyeOffIcon />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-[var(--color-danger-light)]">
                    <TrashIcon />
                  </button>
                </div>
              </CardLayout>
            ))}
          </CardsLayout>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </>
      )}
    </PageLayout>
  );
}
