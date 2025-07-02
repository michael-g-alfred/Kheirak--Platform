import React from "react";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function Services() {
  const services = [
    {
      title: "دعم الحالات الإنسانية",
      description: "نساعد على جمع التبرعات للحالات الطبية والاجتماعية العاجلة.",
    },
    {
      title: "تمويل المشاريع الخيرية",
      description: "تمكين المؤسسات من عرض مشاريعها واستقبال الدعم المالي.",
    },
    {
      title: "التبرع العيني",
      description:
        "نُسهل تقديم تبرعات مثل الطعام، الملابس، والمستلزمات الطبية.",
    },
    {
      title: "ربط المتبرعين بالمستحقين",
      description: "توفير آلية تواصل شفافة وآمنة بين الطرفين.",
    },
  ];

  return (
    <PageLayout>
      <Header_Subheader
        h1="خدماتنا"
        p="نقدم مجموعة من الخدمات التي تهدف إلى تسهيل عملية التبرع وضمان وصول الدعم لمستحقيه بأفضل الطرق وأكثرها أمانًا.">
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-lg shadow p-6 border border-[var(--color-bg-divider)] hover:shadow-md transition"
            style={{
              backgroundColor: "var(--color-bg-card)",
            }}>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--color-primary-base)]">
              {service.title}
            </h2>
            <p className="text-base leading-loose text-[var(--color-bg-text)]">
              {service.description}
            </p>
          </div>
        ))}
      </Header_Subheader>
    </PageLayout>
  );
}
