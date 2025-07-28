import { useState } from "react";
import CreatePostTrigger from "../components/CreatePostTrigger";
import RequestForm from "../components/RequestForm";
import NoData from "../components/NoData";

export default function Posts() {
  const [showRequestFrom, setShowRequestFrom] = useState(false);
  const handleCloseForm = () => {
    setShowRequestFrom(false);
  };
  return (
    <>
      <CreatePostTrigger onClick={() => setShowRequestFrom((prev) => !prev)} />
      {showRequestFrom && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <RequestForm onClose={handleCloseForm} />
        </div>
      )}
      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />
      <NoData h2={"لا توجد طلبات تبرع متاحة الآن"} />
    </>
  );
}
