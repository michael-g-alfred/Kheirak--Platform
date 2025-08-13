import { useCallback, memo } from "react";
import InputField from "../InputField";
import FilterIcon from "../../icons/FilterIcon";
import FilterOffIcon from "../../icons/FilterOffIcon";
import EyeOffIcon from "../../icons/EyeOffIcon";
import EyeIcon from "../../icons/EyeIcon";
import BooleanButton from "../BooleanButton";

function ReviewSection({
  id,
  title,
  filterOpen,
  setFilterOpen,
  statusFilter,
  setStatusFilter,
  statusOptions = statusOptions,
  ReviewComponent,
  show,
  setShow,
}) {
  const toggleShow = useCallback(() => setShow((prev) => !prev), [setShow]);
  const toggleFilterOpen = useCallback(
    () => setFilterOpen((prev) => !prev),
    [setFilterOpen]
  );
  const handleStatusChange = useCallback(
    (e) => setStatusFilter(e.target.value),
    [setStatusFilter]
  );

  const MemoizedReviewComponent = memo(ReviewComponent);

  return (
    <section aria-labelledby={`${id}-heading`}>
      <div className="flex flex-col items-start gap-2 mb-2">
        <div className="flex items-center justify-between w-full">
          <h2
            id={`${id}-heading`}
            className="text-xl font-semibold text-[var(--color-primary-base)]">
            {title}
          </h2>

          <div className="flex gap-2">
            {/* زرار إظهار/إخفاء الكروت */}
            <BooleanButton
              onClick={toggleShow}
              isActive={show}
              labelActive={`إخفاء ${title}`}
              labelInactive={`إظهار ${title}`}
              ActiveIcon={EyeOffIcon}
              InactiveIcon={EyeIcon}
              variant="basic"
              className="ml-2"
            />

            {/* زرار فتح/غلق الفلتر */}
            <BooleanButton
              onClick={toggleFilterOpen}
              isActive={filterOpen}
              labelActive={`إغلاق فلتر ${title}`}
              labelInactive={`فتح فلتر ${title}`}
              ActiveIcon={FilterOffIcon}
              InactiveIcon={FilterIcon}
              variant="basic"
            />
          </div>
        </div>
      </div>

      {/* خيارات الفلترة باستخدام InputField */}
      {filterOpen && (
        <div className="p-4 border border-[var(--color-bg-divider)] rounded bg-[var(--color-bg-card)]">
          <InputField
            label={`حالة ${title}`}
            id={`${id}Status`}
            select={true}
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>
      )}

      {show && <MemoizedReviewComponent statusFilter={statusFilter} />}
    </section>
  );
}

export default memo(ReviewSection);
