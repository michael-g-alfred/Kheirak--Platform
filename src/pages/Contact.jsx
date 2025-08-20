import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import ContactForm from "../components/ContactForm";
import MailboxImage from "../assets/Mailbox-bro.svg";

export default function Contact() {
  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="تواصل معنا"
          p="نسعد بتواصلك معنا لأي استفسارات، اقتراحات، أو شراكات محتملة."
        />
        <main
          role="main"
          aria-label="نموذج التواصل"
          className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 p-4 lg:p-0 max-w-7xl mx-auto">
          {/* الفورم */}
          <div className="w-full lg:w-1/2 px-2 lg:px-4">
            <ContactForm aria-label="نموذج التواصل مع الدعم" />
          </div>

          {/* صورة على الجانب */}
          <div className="w-full lg:w-1/2 flex justify-center mt-4 lg:mt-0 px-2 lg:px-4">
            <img
              src={MailboxImage}
              alt="صورة توضيحية صندوق البريد"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
