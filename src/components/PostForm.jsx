import { useState } from "react";
import uploadImageToCloudinary from "../utils/cloudinary";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import FormLayout from "../layouts/FormLayout";
import CloseIcon from "../icons/CloseIcon";
import { db } from "../Firebase/Firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import { categoryOptions } from "../data/categories";

export default function PostForm({ onClose }) {
  const { currentUser, userData, userName } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const file = data.file?.[0];

      // Check if file exists
      if (!file) {
        toast.error("يرجى اختيار ملف");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("الملف يجب أن يكون صورة");
        return;
      }

      // Check file size (max 2MB)
      const maxSizeMB = 2;
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`حجم الصورة يجب ألا يتجاوز ${maxSizeMB} ميجا`);
        return;
      }

      // Confirm dialog
      if (!window.confirm("هل أنت متأكد من إرسال الطلب؟")) {
        return;
      }

      const imageUrl = await uploadImageToCloudinary(file);
      const docRef = doc(collection(db, "Posts"));
      const newPost = {
        id: docRef.id,
        title: data.title,
        type: data.type,
        details: data.description,
        attachedFiles: imageUrl,
        amount: parseFloat(data.amount),
        totalDonated: 0,
        status: "قيد المراجعة",
        timestamp: serverTimestamp(),
        submittedBy: {
          userName: userName || "مستخدم",
          userId: currentUser?.uid || "anonymous",
          email: currentUser?.email || "unknown@kheirak",
          userPhoto: userData?.photoURL || "",
        },
        donors: [],
      };
      await setDoc(docRef, newPost);
      toast.success("تم إرسال الطلب بنجاح للمراجعة", {
        position: "bottom-center",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب", {
        position: "bottom-center",
      });
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
            className="p-2 danger_Outline font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-danger-light)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close form"
            type="button">
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
          label="نوع الطلب"
          id="type"
          select
          options={categoryOptions}
          register={register("type", { required: "هذا الحقل مطلوب" })}
          error={errors.type}
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
          id="amount"
          type="number"
          placeholder="اكتب المبلغ المطلوب"
          register={register("amount", {
            required: "هذا الحقل مطلوب",
            valueAsNumber: true,
            validate: (value) =>
              value >= 1 || "المبلغ يجب أن يكون رقم موجب أكبر من صفر",
          })}
          error={errors.amount}
        />

        <SubmitButton
          buttonTitle="إرسال الطلب"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </form>
    </FormLayout>
  );
}
