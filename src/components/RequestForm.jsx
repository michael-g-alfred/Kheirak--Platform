import React, { useState } from "react";
import uploadImageToCloudinary from "../utils/cloudinary";
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

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const file = data.file[0]; // Get the uploaded file
      const imageUrl = await uploadImageToCloudinary(file); // Upload to Cloudinary

      const submittedData = {
        ...data,
        file: imageUrl, // Replace file with Cloudinary URL
      };

      console.log("Submitted Data:", submittedData);
      onClose(); // Close the form
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 danger font-bold rounded-full focus:outline-none"
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

        <SubmitButton buttonTitle={"إرسال الطلب"} isLoading={isLoading} />
      </form>
    </FormLayout>
  );
}
