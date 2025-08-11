import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function AdminMessages() {
  return (
    <PageLayout>
      <Header_Subheader
        h1="رسائل الإدارة"
        p="عرض جميع الرسائل الواردة من المستخدمين"
      />
    </PageLayout>
  );
}
