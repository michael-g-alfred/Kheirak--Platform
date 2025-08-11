import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../Firebase/auth";
import { db } from "../Firebase/Firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import { toast } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import GoogleIcon from "../assets/google-logo.svg";
import { useAuth } from "../context/authContext/index";
import Divider from "./Divider";

const schema = yup.object().shape({
  userName: yup.string().required("اسم المستخدم مطلوب"),
  email: yup.string().email("صيغة البريد غير صحيحة").required("البريد مطلوب"),
  password: yup
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
  role: yup
    .string()
    .oneOf(["متبرع", "مستفيد", "مؤسسة"], "نوع المستخدم غير صالح")
    .required("نوع المستخدم مطلوب"),
});

const getFriendlyFirebaseError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "البريد الإلكتروني مستخدم بالفعل.";
    case "auth/invalid-email":
      return "صيغة البريد الإلكتروني غير صحيحة.";
    case "auth/weak-password":
      return "كلمة المرور ضعيفة.";
    case "auth/network-request-failed":
      return "تحقق من اتصال الإنترنت.";
    default:
      return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }
};

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { refreshUserData } = useAuth();

  const onSubmit = async ({ userName, email, password, role }) => {
    setIsLoading(true);
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: userName });

      await setDoc(doc(db, "Users", user.uid), {
        userName,
        email,
        role,
        createdAt: new Date(),
      });

      toast.success("تم إنشاء الحساب بنجاح!");
      await refreshUserData();
      navigate("/");
    } catch (error) {
      const friendlyMsg = getFriendlyFirebaseError(error.code);
      toast.error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // add signup with google and handle choose role page
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const userCredential = await doSignInWithGoogle();
      const user = userCredential.user;
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          userName: user.displayName || "مستخدم Google",
          email: user.email,
          role: "",
          createdAt: new Date(),
        });
      }
      await refreshUserData();
      toast.success("تم إنشاء الحساب بنجاح!");
      const updatedSnap = await getDoc(userRef);
      const role = updatedSnap.data()?.role;
      if (!role) {
        navigate("/choose-role");
      } else {
        navigate("/");
      }
    } catch (error) {
      const friendlyMsg = getFriendlyFirebaseError(error.code);
      toast.error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout formTitle={"إنشاء حساب"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
            { value: "متبرع", label: "متبرع" },
            { value: "مستفيد", label: "مستفيد" },
            { value: "مؤسسة", label: "مؤسسة" },
          ]}
        />

        {/* زر الدخول */}
        <SubmitButton buttonTitle="إنشاء حساب" isLoading={isLoading} />
        <div className="text-center">
          <div className="flex items-center gap-4 mb-4">
            <Divider flexGrow />
            <span className="text-[var(--color-bg-muted-text)] text-md">
              أو
            </span>
            <Divider flexGrow />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-[var(--color-primary-disabled)] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]">
            <span>إنشاء حساب بإستخدام جوجل</span>
            <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          </button>
        </div>
      </form>
    </FormLayout>
  );
};

export default SignUpForm;
