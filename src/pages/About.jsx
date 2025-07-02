import React from "react";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function About() {
  const sections = [
    {
      title: "مهمتنا",
      description:
        "توفير بيئة رقمية موثوقة تُمكّن المتبرعين من دعم المشاريع الخيرية بفعالية وشفافية.",
    },
    {
      title: "رؤيتنا",
      description:
        "أن نكون المنصة الرائدة في مجال العمل الخيري والتبرعات الرقمية في العالم العربي.",
    },
    {
      title: "فريقنا",
      description:
        "يضم فريقنا مجموعة من المتخصصين في التقنية والعمل الخيري، يجمعهم الشغف بخدمة المجتمع والابتكار في تقديم الحلول.",
    },
  ];

  return (
    <PageLayout>
      <Header_Subheader
        h1="من نحن؟"
        p="نحن منصة تهدف إلى تسهيل التبرعات والربط بين المتبرعين والجهات المحتاجة، من خلال واجهة سهلة وآمنة تضمن وصول المساعدات إلى مستحقيها.">
        {sections.map((section, index) => (
          <div
            key={index}
            className="rounded-lg shadow p-6 border border-[var(--color-bg-divider)] hover:shadow-md transition"
            style={{
              backgroundColor: "var(--color-bg-card)",
            }}>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--color-primary-base)]">
              {section.title}
            </h2>
            <p className="text-base leading-loose text-[var(--color-bg-text)]">
              {section.description}
            </p>
          </div>
        ))}
      </Header_Subheader>
    </PageLayout>
  );
}
