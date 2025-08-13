import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import Divider from "./Divider";
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

const schema = yup.object({
  email: yup
    .string()
    .required("البريد الإلكترونى مطلوب")
    .email("صيغة البريد غير صحيحة"),
  password: yup.string().required("كلمة المرور مطلوبة"),
});

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* البريد الإلكتروني */}
        <InputField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="example@example.com"
          register={register("email")}
          error={errors.email}
        />

        {/* كلمة المرور */}
        <InputField
          label="كلمة المرور"
          id="password"
          type="password"
          placeholder="**********"
          register={register("password")}
          error={errors.password}
        />
        {/* زر الدخول */}
        <SubmitButton buttonTitle="تسجيل الدخول" isLoading={isLoading} />
        <div className="text-center">
          <div className="flex items-center gap-4 mb-4">
            <Divider flexGrow />{" "}
            <span className="text-[var(--color-bg-muted-text)] text-md">
              أو
            </span>
            <Divider flexGrow />{" "}
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-[var(--color-primary-disabled)] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]">
            <span>التسجيل بإستخدام جوجل</span>
            <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
