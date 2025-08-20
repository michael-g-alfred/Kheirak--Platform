import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import FormLayout from "../layouts/FormLayout";

const schema = yup.object({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد غير صحيحة"),
});

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://donation-platform-97418.web.app/reset-password",
      });
      toast.success("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.");
    } catch (err) {
      console.error(err);
      toast.error("تعذر إرسال الإيميل. تأكد من صحة البريد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout formTitle={"استعادة كلمة المرور"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <InputField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="example@example.com"
          register={register("email")}
          error={errors.email}
          autoFocus
        />
        <SubmitButton
          buttonTitle="إرسال رابط إعادة التعيين"
          isLoading={isLoading}
        />
      </form>
    </FormLayout>
  );
}
