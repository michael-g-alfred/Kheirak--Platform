import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useState } from "react";

export default function Registration() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <PageLayout>
      <Header_Subheader
        h1="مرحبًا بك في منصتنا!"
        p="نحن سعداء بانضمامك. يمكنك الآن تصفح المنشورات أو التبرع بسهولة."
      />
      {isLogin ? <SignInForm key="signin" /> : <SignUpForm key="signup" />}
      <p className="text-sm text-center text-[var(--color-bg-text)]">
        {isLogin ? "لا تملك حساب؟" : "لديك حساب بالفعل؟"}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-[var(--color-primary-base)] underline cursor-pointer mr-1">
          {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
        </button>
      </p>
    </PageLayout>
  );
}
