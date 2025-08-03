import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import { useState } from "react";
import SubmitButton from "./SubmitButton";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../Firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";
import GoogleIcon from "../assets/google-logo.svg";

const getFriendlyFirebaseError = (code) => {
  switch (code) {
    case "auth/user-not-found":
      return "لا يوجد حساب بهذا البريد.";
    case "auth/wrong-password":
      return "كلمة المرور غير صحيحة.";
    case "auth/invalid-email":
      return "صيغة البريد الإلكتروني غير صحيحة.";
    case "auth/network-request-failed":
      return "تحقق من اتصال الإنترنت.";
    default:
      return "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";
  }
};

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      const userDoc = await getDoc(doc(db, "Users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        toast.success("تم تسجيل الدخول بنجاح");
        setIsLoading(false);
        navigate("/");
      } else {
        toast.error("لم يتم العثور على بيانات المستخدم");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err.message);
      const friendlyMsg = getFriendlyFirebaseError(err.code);
      toast.error(friendlyMsg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const userCredential = await doSignInWithGoogle();
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "Users", uid));

      if (userDoc.exists()) {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      } else {
        toast.error("لم يتم العثور على بيانات المستخدم");
      }
    } catch (err) {
      console.error(err.message);
      const friendlyMsg = getFriendlyFirebaseError(err.code);
      toast.error(friendlyMsg);
    } finally {
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
        <div className="text-center">
          <div className="flex items-center gap-4 mb-4">
            <hr className="flex-grow rounded border-1  border-[var(--color-bg-divider)]" />
            <span className="text-[var(--color-bg-muted-text)] text-md">
              أو قم بتسجيل الدخول عبر
            </span>
            <hr className="flex-grow rounded border-1  border-[var(--color-bg-divider)]" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-[var(--color-secondary-base)] hover:bg-[var(--color-secondary-pressed)] text-[var(--color-bg-muted-text)] border border-[var(--color-bg-divider)]"
          >
            <span>Google</span>
            <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
