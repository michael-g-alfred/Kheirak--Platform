import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";
import FormLayout from "../layouts/FormLayout";

const schema = yup.object({
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
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
      await sendPasswordResetEmail(auth, email);
      toast.success("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال الرابط. تأكد من البريد الإلكتروني");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout formTitle="استعادة كلمة المرور">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        aria-label="نموذج استعادة كلمة المرور">
        <InputField
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="example@email.com"
          register={register("email")}
          error={errors.email}
          aria-required="true"
        />
        <SubmitButton
          buttonTitle="إرسال رابط الاستعادة"
          isLoading={isLoading}
          aria-label="إرسال رابط استعادة كلمة المرور إلى البريد الإلكتروني"
        />
      </form>
    </FormLayout>
  );
}
