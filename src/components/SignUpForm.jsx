import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import { NavLink } from "react-router-dom";

const schema = yup.object().shape({
  username: yup.string().required("اسم المستخدم مطلوب"),
  email: yup.string().email("صيغة البريد غير صحيحة").required("البريد مطلوب"),
  password: yup
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
  role: yup
    .string()
    .oneOf(["donor", "needy", "organization"], "نوع المستخدم غير صالح")
    .required("نوع المستخدم مطلوب"),
});

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ username, email, password, role }) => {
    alert(`تم التسجيل بنجاح
اسم المستخدم: ${username}
البريد: ${email}
كلمة المرور: ${password}
النوع: ${role}`);
  };

  return (
    <FormLayout formTitle={"إنشاء حساب"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="اسم المستخدم"
          id="username"
          placeholder="اسم المستخدم"
          register={register("username")}
          error={errors.username}
        />

        <InputField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="البريد الإلكتروني"
          register={register("email")}
          error={errors.email}
        />

        <InputField
          label="كلمة المرور"
          id="password"
          type="password"
          placeholder="كلمة المرور"
          register={register("password")}
          error={errors.password}
        />

        <InputField
          label="نوع المستخدم"
          id="role"
          select
          register={register("role")}
          error={errors.role}
          options={[
            { value: "", label: "اختر نوع المستخدم" },
            { value: "donor", label: "متبرع" },
            { value: "needy", label: "محتاج" },
            { value: "organization", label: "مؤسسة" },
          ]}
        />

        {/* زر التسجيل */}
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
          إنشاء حساب
        </button>
      </form>
    </FormLayout>
  );
};

export default SignUpForm;
