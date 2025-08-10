import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function Portfolio() {
  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="أعمالنا"
          p="تابع أحدث إنجازاتنا وحملاتنا الميدانية ضمن هذه الصفحة."
        />
        <main role="main" aria-label="معرض الأعمال">
          <section className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div
                className="text-6xl mb-6"
                role="img"
                aria-label="أيقونة البناء">
                🚧
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-bg-text-dark)] mb-4">
                قيد التطوير
              </h2>
              <p className="text-lg text-[var(--color-bg-muted-text)] mb-8">
                نعمل حالياً على إعداد معرض شامل لأعمالنا وإنجازاتنا. سيتم عرض
                مشاريعنا وحملاتنا الخيرية قريباً.
              </p>
              <div className="bg-[var(--color-secondary-base)] rounded-lg p-6 text-right">
                <h3 className="text-xl font-semibold text-[var(--color-bg-text-dark)] mb-3">
                  ما سيتم عرضه قريباً:
                </h3>
                <ul className="space-y-2 text-[var(--color-bg-muted-text)]">
                  <li className="flex items-center">
                    <span className="ml-2">📸</span>
                    صور من حملاتنا الخيرية
                  </li>
                  <li className="flex items-center">
                    <span className="ml-2">📊</span>
                    إحصائيات التأثير والإنجازات
                  </li>
                  <li className="flex items-center">
                    <span className="ml-2">🎥</span>
                    مقاطع فيديو من الأنشطة الميدانية
                  </li>
                  <li className="flex items-center">
                    <span className="ml-2">📝</span>
                    قصص نجاح المستفيدين
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
