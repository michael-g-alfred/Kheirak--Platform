import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import FormLayout from "../layouts/FormLayout";

const schema = yup.object({
  password: yup
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "كلمات المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
});

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkCode = async () => {
      if (!oobCode || mode !== "resetPassword") {
        toast.error("الرابط غير صالح أو منتهي الصلاحية");
        navigate("/forgot-password");
        return;
      }
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
      } catch (err) {
        console.error(err);
        toast.error("الرابط غير صالح أو منتهي الصلاحية");
        navigate("/forgot-password");
      }
    };
    checkCode();
  }, [oobCode, mode, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ password }) => {
    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("تم تعيين كلمة المرور الجديدة بنجاح");
      navigate("/registration");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تعيين كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout formTitle="إعادة تعيين كلمة المرور">
      {/* وصف البريد للقارئات الصوتية */}
      <p
        className="mb-4 text-[var(--color-bg-text-dark)] text-sm"
        aria-live="polite">
        البريد المرتبط: <span className="font-bold">{email}</span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        aria-label="نموذج إعادة تعيين كلمة المرور">
        <InputField
          label="كلمة المرور الجديدة"
          id="password"
          type="password"
          placeholder="••••••••"
          register={register("password")}
          error={errors.password}
          aria-required="true"
          aria-invalid={errors.password ? "true" : "false"}
        />

        <InputField
          label="تأكيد كلمة المرور الجديدة"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          aria-required="true"
          aria-invalid={errors.confirmPassword ? "true" : "false"}
        />

        <SubmitButton
          buttonTitle="حفظ كلمة المرور"
          isLoading={isLoading}
          aria-label="حفظ كلمة المرور الجديدة"
        />
      </form>
    </FormLayout>
  );
}
