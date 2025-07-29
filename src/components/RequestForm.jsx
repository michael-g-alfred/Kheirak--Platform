import React, { useState } from "react";
import uploadImageToCloudinary from "../utils/cloudinary";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import FormLayout from "../layouts/FormLayout";
import CloseIcon from "../icons/CloseIcon";
import { db } from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

export default function RequestForm({ onClose }) {
  const { currentUser, userData, username } = useAuth();

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
      const imageUrl = await uploadImageToCloudinary(file);
      const newPost = {
        requestTitle: data.title,
        details: data.description,
        attachedFiles: imageUrl,
        requestedAmount: parseFloat(data.moneyAmount),
        totalDonated: 0,
        status: "قيد المراجعة",
        timestamp: serverTimestamp(),
        submittedBy: {
          userName: username || "مستخدم",
          userId: currentUser.uid,
          email: currentUser.email,
          userPhoto: userData?.photoURL || "",
        },
        donors: [],
      };
      const docRef = await addDoc(collection(db, "Posts"), newPost);
      await updateDoc(docRef, {
        id: docRef.id,
      });
      toast.success("تم إرسال الطلب بنجاح!");
      console.log("تم رفع الطلب:", newPost);
      onClose();
    } catch (error) {
      console.error("فشل الرفع:", error);
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

        <SubmitButton buttonTitle="إرسال الطلب" isLoading={isLoading} />
      </form>
    </FormLayout>
  );
}
