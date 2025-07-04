import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function Register() {
  return (
    <PageLayout>
      <Header_Subheader
        h1="مرحبًا بك في منصتنا!"
        p="نحن سعداء بانضمامك. يمكنك الآن تصفح المنشورات أو التبرع بسهولة."
      />
    </PageLayout>
  );
}
