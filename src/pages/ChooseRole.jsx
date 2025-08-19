import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import PageLayout from "../layouts/PageLayout";
import FormLayout from "../layouts/FormLayout";
import { useForm } from "react-hook-form";
import Header_Subheader from "../components/Header_Subheader";

const ChooseRole = () => {
  const { currentUser, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (userData?.role) {
      navigate("/");
    }
  }, [currentUser, userData, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userRef = doc(db, "Users", currentUser.uid);
      await updateDoc(userRef, {
        role: data.role,
      });
      await refreshUserData();
      toast.success("تم تعيين نوع المستخدم بنجاح");
      navigate("/");
    } catch (error) {
      toast.error("حدث خطأ ما، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <Header_Subheader
        h1="اختر نوع المستخدم"
        p="يرجى اختيار نوع الحساب الخاص بك لإكمال التسجيل"
      />
      <FormLayout>
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          role="form"
          aria-label="نموذج اختيار نوع المستخدم">
          <InputField
            label="نوع المستخدم"
            id="role"
            select
            register={register("role", {
              required: "يرجى اختيار نوع المستخدم",
            })}
            error={errors.role}
            placeholder="اختر نوع المستخدم"
            options={[
              { value: "مستفيد", label: "مستفيد" },
              { value: "متبرع", label: "متبرع" },
              { value: "مؤسسة", label: "مؤسسة" },
            ]}
          />
          <SubmitButton buttonTitle="تأكيد" isLoading={isLoading} />
        </form>
      </FormLayout>
    </PageLayout>
  );
};

export default ChooseRole;
