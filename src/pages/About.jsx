import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import CardsLayout from "../layouts/CardsLayout";

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
      <div dir="rtl">
        <Header_Subheader
          h1="من نحن؟"
          p="خِيرُكَ .. منصة تهدف إلى تسهيل التبرعات والربط بين المتبرعين والمستفيدين، من خلال واجهة سهلة وآمنة تضمن وصول المساعدات إلى مستحقيها."
        />
        <main role="main" aria-label="معلومات عن منصة خيرك">
          <CardsLayout list={sections} />
        </main>
      </div>
    </PageLayout>
  );
}
