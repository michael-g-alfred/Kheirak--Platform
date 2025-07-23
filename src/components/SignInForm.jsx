import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) => {
    console.log("تم إرسال البيانات:", { email, password });
  };

  return (
    <FormLayout formTitle={"تسجيل الدخول"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* البريد الإلكتروني */}
        <InputField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="example@example.com"
          register={register("email", {
            required: "البريد مطلوب",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "صيغة البريد غير صحيحة",
            },
          })}
          error={errors.email}
        />

        {/* كلمة المرور */}
        <InputField
          label="كلمة المرور"
          id="password"
          type="password"
          placeholder="**********"
          register={register("password", {
            required: "كلمة المرور مطلوبة",
          })}
          error={errors.password}
        />

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
      </form>
    </FormLayout>
  );
}
