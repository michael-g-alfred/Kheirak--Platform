import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useState } from "react";

export default function Registration() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="مرحبًا بك في منصتنا!"
          p="نحن سعداء بانضمامك. يمكنك الآن تصفح المنشورات أو التبرع بسهولة."
        />

        <main role="main" aria-label="نموذج التسجيل">
          {isLogin ? <SignInForm key="signin" /> : <SignUpForm key="signup" />}

          <div className="text-center mt-6">
            <p className="text-sm text-[var(--color-bg-text)] mb-2">
              {isLogin ? "لا تملك حساب؟" : "لديك حساب بالفعل؟"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[var(--color-primary-base)] underline font-bold px-2 py-1 rounded cursor-pointer"
                aria-label={
                  isLogin
                    ? "التبديل إلى نموذج إنشاء حساب جديد"
                    : "التبديل إلى نموذج تسجيل الدخول"
                }>
                {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
              </button>
            </p>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
