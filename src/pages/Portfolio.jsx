import React from "react";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";

export default function Portfolio() {
  return (
    <PageLayout>
      <Header_Subheader
        h1={"أعمالنا"}
        p="تابع أحدث إنجازاتنا وحملاتنا الميدانية ضمن هذه الصفحة."
      />
    </PageLayout>
  );
}
