import FormLayout from "../layouts/FormLayout";
import BulletPoints from "../components/BulletPoints";
import InputField from "../components/InputField";
import Loader from "../components/Loader";

const ConfirmModal = ({
  title, // عنوان المودال
  description, // نص أساسي يوضح العملية
  bulletPoints = [], // مصفوفة نصوص لعرضها داخل BulletPoints
  showInput = false, // هل يظهر حقل إدخال
  inputProps = {}, // خصائص حقل الإدخال {id, label, value, onChange, type, placeholder, min}
  warningText = "", // نص التحذير
  confirmText = "تأكيد", // نص زر التأكيد
  cancelText = "إغلاق", // نص زر الإلغاء
  onConfirm, // دالة التأكيد
  onClose, // دالة الإغلاق
  isLoading = false, // حالة التحميل
}) => {
  const handleConfirm = () => {
    if (showInput && inputProps.value !== undefined && inputProps.value < 1) {
      alert("القيمة يجب أن تكون 1 أو أكثر");
      return;
    }
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title">
      <FormLayout
        formTitle={
          <span
            id="confirm-modal-title"
            className="text-[var(--color-primary-base)] rounded">
            {title}
          </span>
        }>
        <div className="text-[var(--color-bg-text-dark)] text-right space-y-2 mb-4">
          {description && <p className="text-md">{description}</p>}
          <div className="px-2">
            {bulletPoints.map((bp, index) => (
              <BulletPoints key={index} content={bp} />
            ))}
          </div>
          {showInput && (
            <div className="mt-3">
              <InputField {...inputProps} />
            </div>
          )}
          {warningText && (
            <p className="bg-[var(--color-danger-light)] text-[var(--color-bg-text)] rounded border border-[var(--color-bg-divider)] p-1 px-2 mt-6 text-center font-bold">
              {warningText}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            className="danger px-6 py-2 rounded font-semibold"
            onClick={onClose}>
            {cancelText}
          </button>
          <button
            className="success px-6 py-2 rounded font-semibold"
            onClick={handleConfirm}>
            {isLoading ? (
              <Loader borderColor="var(--color-bg-text)" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </FormLayout>
    </div>
  );
};

export default ConfirmModal;
