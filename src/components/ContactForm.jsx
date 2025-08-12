import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./InputField";
import FormLayout from "../layouts/FormLayout";
import SubmitButton from "./SubmitButton";
import { toast } from "react-hot-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

const schema = yup.object().shape({
  name: yup.string().required("الاسم مطلوب").min(2, "قصير جدًا"),
  email: yup
    .string()
    .email("بريد إلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  phone: yup.string().optional(),
  message: yup.string().required("الرسالة مطلوبة").min(10, "قصير جدًا"),
});

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      toast.loading("جاري إرسال الرسالة...");

      await addDoc(collection(db, "ContactMessages"), {
        name: data.name,
        email: data.email,
        phone: data.phone || "لا يوجد",
        message: data.message,
        timestamp: serverTimestamp(),
      });

      toast.dismiss();
      toast.success("تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.");
      reset();
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.dismiss();
      toast.error("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 text-right"
        dir="rtl"
      >
        <InputField
          label="الاسم *"
          id="name"
          type="text"
          placeholder="ادخل اسمك"
          register={register("name")}
          error={errors.name}
        />
        <InputField
          label="رقم الهاتف"
          id="phone"
          type="text"
          placeholder="ادخل رقم هاتفك"
          register={register("phone")}
          error={errors.phone}
        />
        <InputField
          label="البريد الإلكتروني *"
          id="email"
          type="email"
          placeholder="ادخل بريدك الإلكتروني"
          register={register("email")}
          error={errors.email}
        />
        <InputField
          label="الرسالة *"
          id="message"
          type="textarea"
          placeholder="اكتب رسالتك..."
          register={register("message")}
          error={errors.message}
        />

        <SubmitButton buttonTitle="إرسال" isLoading={isSubmitting} />
      </form>
    </FormLayout>
  );
}
