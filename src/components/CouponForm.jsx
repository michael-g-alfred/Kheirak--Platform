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
import toast from "react-hot-toast";

export default function CouponForm({ onClose }) {
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
      const file = data.file[0];
      if (!file.type.startsWith("image/")) {
        toast.error("الملف يجب أن يكون صورة");
        setIsLoading(false);
        return;
      }
      const maxSizeMB = 2;
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`حجم الصورة يجب ألا يتجاوز ${maxSizeMB} ميجا`);
        setIsLoading(false);
        return;
      }

      if (!window.confirm("هل أنت متأكد من إرسال الكوبون؟")) {
        setIsLoading(false);
        return;
      }

      const imageUrl = await uploadImageToCloudinary(file);
      const docRef = doc(collection(db, "Coupons"));
      const newCoupon = {
        id: docRef.id,
        title: data.title,
        details: data.description,
        type: data.type,
        attachedFiles: imageUrl,
        stock: parseFloat(data.stock),
        status: "قيد المراجعة",
        timestamp: serverTimestamp(),
        submittedBy: {
          userName: userName || "مستخدم",
          userId: currentUser.uid,
          email: currentUser.email,
          userPhoto: userData?.photoURL || "",
        },
        beneficiaries: [],
      };
      await setDoc(docRef, newCoupon);
      toast.success("تم إرسال الطلب بنجاح للمراجعة");
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 danger font-bold rounded-full focus:outline-none"
            aria-label="Close form"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <InputField
          label="اسم الكوبون"
          id="title"
          placeholder="اكتب عنوان الكوبون"
          register={register("title", { required: "هذا الحقل مطلوب" })}
          error={errors.title}
        />

        <InputField
          label="نوع الكوبون"
          id="type"
          select
          options={[
            { value: "طعام", label: "طعام" },
            { value: "دواء", label: "دواء" },
            { value: "ملابس", label: "ملابس" },
            { value: "كهرباء", label: "كهرباء" },
            { value: "خدمات", label: "خدمات" },
            { value: "تعليم", label: "تعليم" },
          ]}
          register={register("type", { required: "هذا الحقل مطلوب" })}
          error={errors.type}
        />
        <InputField
          label="تفاصيل الكوبون"
          id="description"
          type="textarea"
          placeholder="اكتب تفاصيل الكوبون"
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
          label="الكمية المتاحة"
          id="stock"
          type="number"
          placeholder="اكتب الكمية المتاحة من الكوبون"
          register={register("stock", { required: "هذا الحقل مطلوب" })}
          error={errors.stock}
        />

        <SubmitButton
          buttonTitle="إرسال الكوبون"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </form>
    </FormLayout>
  );
}
