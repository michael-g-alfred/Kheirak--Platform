export default function PageLayout({ children, x = "start", y = "" }) {
  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col justify-${x} items-${y} gap-4 w-full mx-auto py-24 px-4 md:px-4 lg:px-6 overflow-x-hidden`}>
      {children}
    </div>
  );
}
