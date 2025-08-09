import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="تواصل معنا"
          p="نسعد بتواصلك معنا لأي استفسارات، اقتراحات، أو شراكات محتملة."
        />
        <main role="main" aria-label="نموذج التواصل">
          <ContactForm />
        </main>
      </div>
    </PageLayout>
  );
}
