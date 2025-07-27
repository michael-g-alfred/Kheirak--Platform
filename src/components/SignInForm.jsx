import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import { useState } from "react";
import SubmitButton from "./SubmitButton";
import { doSignInWithEmailAndPassword } from "../Firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const userCredential = await doSignInWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setMsg("✅ تم تسجيل الدخول بنجاح");
        setIsLoading(false);
        navigate("/");
      } else {
        setMsg("❌ لم يتم العثور على بيانات المستخدم");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err.message);
      setMsg("❌ فشل في تسجيل الدخول: " + err.message);
      setIsLoading(false);
    }
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
        <SubmitButton buttonTitle="تسجيل الدخول" isLoading={isLoading} />

        {/* عرض رسالة الخطأ أو النجاح */}
        {msg && <p className="text-center mt-3">{msg}</p>}
      </form>
    </FormLayout>
  );
}
