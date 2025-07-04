import { useForm } from "react-hook-form";
import PageLayout from "../layouts/PageLayout";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) => {
    console.log("تم إرسال البيانات:", { email, password });
  };

  return (
    <div className="w-full sm:w-2/3 lg:w-1/3 mx-auto rounded-lg shadow p-6 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]">
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-primary-base)]">
        تسجيل الدخول
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* البريد الإلكتروني */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-[var(--color-bg-text)]">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            {...register("email", {
              required: "البريد مطلوب",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "صيغة البريد غير صحيحة",
              },
            })}
            type="email"
            placeholder="example@example.com"
            className={`w-full px-4 py-2 rounded-lg border bg-transparent text-[var(--color-bg-text)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-base)] ${
              errors.email
                ? "border-[var(--color-danger-dark-plus)]"
                : "border-[var(--color-bg-divider)]"
            }`}
          />
          {errors.email && (
            <p className="bg-[var(--color-danger-dark-plus)] text-[var(--color-danger-light)] mt-1 text-sm rounded px-1 py-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* كلمة المرور */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-[var(--color-bg-text)]">
            كلمة المرور
          </label>
          <input
            id="password"
            {...register("password", { required: "كلمة المرور مطلوبة" })}
            type="password"
            placeholder="**********"
            className={`w-full px-4 py-2 rounded-lg border bg-transparent text-[var(--color-bg-text)] placeholder-[var(--color-bg-muted-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-base)] ${
              errors.password
                ? "border-[var(--color-danger-dark-plus)]"
                : "border-[var(--color-bg-divider)]"
            }`}
          />
          {errors.password && (
            <p className="bg-[var(--color-danger-dark-plus)] text-[var(--color-danger-light)] mt-1 text-sm rounded px-1 py-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* زر الدخول */}
        <button
          type="submit"
          className="w-full text-[var(--color-secondary-base)] font-bold py-2 px-4 rounded-md transition cursor-pointer bg-[var(--color-primary-base)]"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-primary-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-primary-base)")
          }>
          تسجيل الدخول
        </button>
        <p className="text-center text-sm mt-4 text-[var(--color-bg-muted-text)]">
          لا تملك حساب؟{" "}
          <button
            type="button"
            className="text-[var(--color-primary-base)] underline cursor-pointer">
            أنشئ حساب
          </button>
        </p>
      </form>
    </div>
  );
}
