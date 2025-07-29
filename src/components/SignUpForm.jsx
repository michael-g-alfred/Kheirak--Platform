import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import { doCreateUserWithEmailAndPassword } from "../Firebase/auth";
import { db } from "../Firebase/Firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";

const schema = yup.object().shape({
  userName: yup.string().required("اسم المستخدم مطلوب"),
  email: yup.string().email("صيغة البريد غير صحيحة").required("البريد مطلوب"),
  password: yup
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
  role: yup
    .string()
    .oneOf(["متبرع", "مستفيد", "مؤسسة", "مشرف"], "نوع المستخدم غير صالح")
    .required("نوع المستخدم مطلوب"),
});

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async ({ userName, email, password, role }) => {
    try {
      setIsLoading(true);
      const userCredential = await doCreateUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        userName,
        email,
        role,
        createdAt: new Date(),
      });

      setMsg("✅ تم إنشاء الحساب بنجاح!");
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setMsg("❌ " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <FormLayout formTitle={"إنشاء حساب"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* اسم المستخدم*/}
        <InputField
          label="اسم المستخدم"
          id="userName"
          placeholder="اسم المستخدم"
          register={register("userName")}
          error={errors.userName}
        />

        {/* البريد الإلكترونى */}
        <InputField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="البريد الإلكتروني"
          register={register("email")}
          error={errors.email}
        />

        {/* كلمة المرور */}
        <InputField
          label="كلمة المرور"
          id="password"
          type="password"
          placeholder="كلمة المرور"
          register={register("password")}
          error={errors.password}
        />

        {/* نوع المستخدم */}

        <InputField
          label="نوع المستخدم"
          id="role"
          select
          register={register("role")}
          error={errors.role}
          options={[
            { value: "", label: "اختر نوع المستخدم" },
            { value: "متبرع", label: "متبرع" },
            { value: "مستفيد", label: "مستفيد" },
            { value: "مؤسسة", label: "مؤسسة" },
            { value: "مشرف", label: "مشرف" },
          ]}
        />

        {/* زر الدخول */}
        <SubmitButton buttonTitle="إنشاء حساب" isLoading={isLoading} />

        {/* عرض رسالة الخطأ أو النجاح */}
        {msg && (
          <p className="w-full flex justify-center items-center border-2 border-[var(--color-bg-divider)] bg-[var(--color-bg-card)] text-[var(--color-bg-text)] p-1 rounded-full text-center mt-2">
            {msg}
          </p>
        )}
      </form>
    </FormLayout>
  );
};

export default SignUpForm;
