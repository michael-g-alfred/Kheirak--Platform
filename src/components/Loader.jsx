export default function Loader() {
  return (
    <div
      className="w-full flex justify-center items-center"
      role="status"
      aria-label="جاري التحميل...">
      <span
        className="inline-block w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
    </div>
  );
}
