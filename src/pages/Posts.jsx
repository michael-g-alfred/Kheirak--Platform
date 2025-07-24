import React, { useState } from "react";
import CreatePostTrigger from "../components/CreatePostTrigger";
import RequestForm from "../components/RequestForm";
import FaceSadIcon from "../icons/FaceSadIcon";

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
      <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-md p-6 border border-[var(--color-bg-divider)] hover:shadow-lg transition-all text-center">
        <div className="flex justify-center text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
          <FaceSadIcon />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
          لا توجد طلبات تبرع متاحة الآن.
        </h2>
      </div>
    </>
  );
}
