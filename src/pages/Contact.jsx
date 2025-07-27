import React from "react";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <PageLayout>
      <Header_Subheader
        h1="تواصل معنا"
        p="نسعد بتواصلك معنا لأي استفسارات، اقتراحات، أو شراكات محتملة."
      />
      <ContactForm />
    </PageLayout>
  );
}
