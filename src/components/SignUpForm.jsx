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
import { toast } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import GoogleIcon from "../assets/google-logo.svg";

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
      return "كلمة المرور ضعيفة جداً.";
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

  const onSubmit = async ({ userName, email, password, role }) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      const friendlyMsg = getFriendlyFirebaseError(error.code);
      toast.error(friendlyMsg);
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
            { value: "متبرع", label: "متبرع" },
            { value: "مستفيد", label: "مستفيد" },
            { value: "مؤسسة", label: "مؤسسة" },
          ]}
        />

        {/* زر الدخول */}
        <SubmitButton buttonTitle="إنشاء حساب" isLoading={isLoading} />
        <div className="text-center">
          <div className="flex items-center gap-4 mb-4">
            <hr className="flex-grow rounded border-1  border-[var(--color-bg-divider)]" />
            <span className="text-[var(--color-bg-muted-text)] text-md">
              أو قم بإنشاء حساب عبر
            </span>
            <hr className="flex-grow rounded border-1  border-[var(--color-bg-divider)]" />
          </div>
          <button
            type="button"
            onClick={""}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-[var(--color-secondary-base)] hover:bg-[var(--color-secondary-pressed)] text-[var(--color-bg-muted-text)] border border-[var(--color-bg-divider)]">
            <span>Google</span>
            <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          </button>
        </div>
      </form>
    </FormLayout>
  );
};

export default SignUpForm;
