import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import { useState } from "react";
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
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
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

        if (role === "donor") navigate("/donor-profile");
        else if (role === "needy") navigate("/");
        else if (role === "organization") navigate("/");
        else navigate("/");
      } else {
        setMsg("❌ لم يتم العثور على بيانات المستخدم");
      }
    } catch (err) {
      console.error(err.message);
      setMsg("❌ فشل في تسجيل الدخول: " + err.message);
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
          }
        >
          تسجيل الدخول
        </button>

        {/* عرض رسالة الخطأ أو النجاح */}
        {msg && <p className="text-center mt-3">{msg}</p>}
      </form>
    </FormLayout>
  );
}
