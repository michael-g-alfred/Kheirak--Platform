import React from "react";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function Contact() {
  return (
    <PageLayout>
      <Header_Subheader
        h1="تواصل معنا"
        p="نسعد بتواصلك معنا لأي استفسارات، اقتراحات، أو شراكات محتملة."
      />
    </PageLayout>
  );
}
