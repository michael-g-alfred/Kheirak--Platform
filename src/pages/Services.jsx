import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import CardsLayout from "../layouts/CardsLayout";

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
      <div dir="rtl">
        <Header_Subheader
          h1="خدماتنا"
          p="نقدم مجموعة من الخدمات التي تهدف إلى تسهيل عملية التبرع وضمان وصول الدعم لمستحقيه بأفضل الطرق وأكثرها أمانًا."
        />

        <main role="main" aria-label="قائمة الخدمات">
          <section aria-label="خدمات المنصة">
            <CardsLayout list={services} colNum={3} />
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
