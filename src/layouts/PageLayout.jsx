export default function PageLayout({ children, x = "start", y = "" }) {
  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col justify-${x} items-${y} gap-4 w-full mx-auto py-24 px-4 md:px-6 lg:px-8 overflow-x-hidden`}>
      {children}
    </div>
  );
}
