import React from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import FormLayout from "../layouts/FormLayout";
import CloseIcon from "../icons/CloseIcon";

export default function RequestForm({ onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 bg-[var(--color-danger-light)] text-[var(--color-danger-dark)] hover:bg-[var(--color-danger-dark)] hover:text-[var(--color-danger-light)] font-bold rounded-full focus:outline-none"
            aria-label="Close form">
            <CloseIcon />
          </button>
        </div>
        <InputField
          label="اسم الطلب"
          id="title"
          placeholder="اكتب عنوان الطلب"
          register={register("title", { required: "هذا الحقل مطلوب" })}
          error={errors.title}
        />

        <InputField
          label="تفاصيل الطلب"
          id="description"
          type="textarea"
          placeholder="اكتب تفاصيل الطلب"
          register={register("description", { required: "هذا الحقل مطلوب" })}
          error={errors.description}
        />

        <InputField
          label="الملف المرفق"
          id="file"
          type="file"
          register={register("file", { required: "هذا الحقل مطلوب" })}
          error={errors.file}
        />

        <InputField
          label="المبلغ المطلوب"
          id="moneyAmount"
          type="number"
          placeholder="اكتب المبلغ المطلوب"
          register={register("moneyAmount", { required: "هذا الحقل مطلوب" })}
          error={errors.moneyAmount}
        />

        <SubmitButton buttonTitle={"إرسال الطلب"} />
      </form>
    </FormLayout>
  );
}
