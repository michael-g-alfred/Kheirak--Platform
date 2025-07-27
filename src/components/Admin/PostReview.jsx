import React, { useState, useEffect } from "react";
import CardLayout from "../../layouts/CardLayout";
import CardsLayout from "../../layouts/CardsLayout";

export default function PostReview() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts([
      {
        id: 1,
        title: "مساعدة مالية طارئة",
        description: "أحتاج إلى مساعدة لتغطية إيجار هذا الشهر.",
        attachments: ["صورة عقد الإيجار", "كشف حساب بنكي"],
        amount: "1500 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 2,
        title: "طلب توفير علاج",
        description: "أعاني من حالة صحية مزمنة وأحتاج إلى دواء دائم.",
        attachments: ["تقرير طبي", "وصفة الدواء"],
        amount: "2000 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 3,
        title: "مساعدة في مصاريف الدراسة",
        description: "أحتاج إلى دفع مصروفات المدرسة لأطفالي.",
        attachments: ["بيان المدرسة", "إيصال رسوم"],
        amount: "1800 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 4,
        title: "طلب توفير طعام شهري",
        description: "لا أملك دخل ثابت وأحتاج لطعام أساسي لشهر.",
        attachments: ["صورة بطاقة تموين"],
        amount: "1000 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 5,
        title: "مساعدة لتجهيز سكن بسيط",
        description: "أحتاج إلى أدوات منزلية أساسية للسكن.",
        attachments: ["عقد سكن مؤقت"],
        amount: "2500 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 6,
        title: "طلب دعم مشروع صغير",
        description: "أرغب في تمويل مشروع بيع بسيط لتحسين دخلي.",
        attachments: ["دراسة جدوى", "صور المعدات"],
        amount: "3000 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 7,
        title: "مساعدة لسداد دين",
        description: "متراكم عليّ دين قديم وأحتاج إلى المساعدة في سداده.",
        attachments: ["إثبات دين"],
        amount: "2200 جنيه",
        status: "قيد المراجعة",
      },
      {
        id: 8,
        title: "طلب علاج طبيعي",
        description: "أحتاج إلى جلسات علاج طبيعي لمدة شهر.",
        attachments: ["تقرير المستشفى"],
        amount: "1600 جنيه",
        status: "قيد المراجعة",
      },
    ]);
  }, []);

  const handleApprove = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: "مقبول" } : post))
    );
  };

  const handleReject = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: "مرفوض" } : post))
    );
  };

  return (
    <CardsLayout colNum={4}>
      {posts.map((post) => (
        <CardLayout
          key={post.id}
          title={`#${post.id} - ${post.title}`}
          description={post.description}>
          <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
            <p>
              <strong>المرفقات: </strong> {post.attachments?.join("، ")}
            </p>
            <p>
              <strong>المبلغ المطلوب: </strong> {post.amount}
            </p>
            <p>
              <strong>الحالة: </strong> {post.status}
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleApprove(post.id)}
              className="bg-[var(--color-success-light)] hover:bg-[var(--color-success-dark)] text-[var(--color-bg-text)] px-6 py-3 rounded text-md">
              قبول
            </button>
            <button
              onClick={() => handleReject(post.id)}
              className="bg-[var(--color-danger-dark)] hover:bg-[var(--color-danger-dark-plus)] text-[var(--color-bg-text)] px-6 py-3 rounded text-md">
              رفض
            </button>
          </div>
        </CardLayout>
      ))}
    </CardsLayout>
  );
}
