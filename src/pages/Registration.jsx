import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useState } from "react";
import WelcomeImage from "../assets/Welcome-bro.svg";

export default function Registration() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="مرحبًا بك في منصتنا!"
          p="نحن سعداء بانضمامك. يمكنك الآن تصفح المنشورات أو التبرع بسهولة."
        />

        <main
          role="main"
          aria-label="نموذج التسجيل"
          className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 p-4 lg:p-0 max-w-7xl mx-auto">
          {/* الفورم */}
          <div className="w-full lg:w-1/2 px-2 lg:px-4">
            {isLogin ? (
              <SignInForm key="signin" />
            ) : (
              <SignUpForm key="signup" />
            )}
            <div className="text-center mt-2">
              <p className="text-sm text-[var(--color-bg-text-dark)] mb-2">
                {isLogin ? "لا تملك حساب؟" : "لديك حساب بالفعل؟"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[var(--color-primary-base)] underline font-bold px-2 py-1 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
                  aria-label={
                    isLogin
                      ? "التبديل إلى نموذج إنشاء حساب جديد"
                      : "التبديل إلى نموذج تسجيل الدخول"
                  }>
                  {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
                </button>
              </p>
            </div>
          </div>
          {/* الصورة على الجانب أو فوق */}
          <div className="w-full lg:w-1/2 flex justify-center mt-4 lg:mt-0 px-2 lg:px-4">
            <img
              src={WelcomeImage}
              alt="صورة توضيحية صندوق البريد"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
