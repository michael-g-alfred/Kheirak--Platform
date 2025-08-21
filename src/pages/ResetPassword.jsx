import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import WelcomeImage from "../assets/Welcome-bro.svg";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <PageLayout>
      <div dir="rtl">
        {/* العنوان الرئيسي مع تحسين الوصول */}
        <Header_Subheader
          h1="مرحبًا بك في منصتنا!"
          p="نحن سعداء بانضمامك. يمكنك الآن تصفح المنشورات أو التبرع بسهولة."
        />

        <main
          role="main"
          aria-label="نموذج إعادة تعيين كلمة المرور"
          className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 p-4 lg:p-0 max-w-7xl mx-auto">
          {/* الفورم */}
          <div className="w-full lg:w-1/2 px-2 lg:px-4">
            <h2 className="sr-only">نموذج إعادة تعيين كلمة المرور</h2>
            <ResetPasswordForm />
          </div>
          {/* الصورة أولًا بصريًا وسمعيًا على الموبايل */}
          <div className="w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0 px-2 lg:px-4">
            <img
              src={WelcomeImage}
              alt="شخص يستخدم منصة التبرعات عبر الإنترنت"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
