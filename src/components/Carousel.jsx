import { useState, useEffect, useCallback } from "react";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
    title: "ساهم في بناء منزل لأسرة محتاجة",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
    title: "تبرّع لتوفير العلاج لطفل مصاب",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
    title: "شارك في توزيع سلال غذائية",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1544476915-ed1370594142?auto=format&fit=crop&w=800&q=80",
    title: "ادعم تعليم الأطفال في القرى",
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Preload next image
  useEffect(() => {
    const nextIndex = (current + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [current]);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  return (
    <div
      className="w-full mx-auto bg-[var(--color-bg-card)] rounded-lg text-center relative border border-[var(--color-bg-divider)] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="صور متحركة للمشاريع الخيرية">
      <div className="overflow-hidden h-64 sm:h-72 md:h-80 lg:h-100 relative">
        <img
          src={slides[current].image}
          alt={slides[current].title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/800x400/cccccc/666666?text=صورة+غير+متوفرة";
          }}
        />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[var(--color-bg-card)]/50 backdrop-blur-sm text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] p-2 hover:bg-[var(--color-bg-card)]/70 rounded-full transition-all duration-200"
          aria-label="الصورة السابقة">
          <ChevronLeftIcon />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[var(--color-bg-card)]/50 backdrop-blur-sm text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] p-2 hover:bg-[var(--color-bg-card)]/70 rounded-full transition-all duration-200"
          aria-label="الصورة التالية">
          <ChevronRightIcon />
        </button>

        <h2 className="absolute bottom-8 right-0 left-0 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold bg-[var(--color-bg-card)]/50 backdrop-blur-sm text-[var(--color-primary-base)] border-y border-[var(--color-bg-divider)] px-4 py-3">
          {slides[current].title}
        </h2>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 right-0 left-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-5 h-5 rounded-full transition-all duration-200 ${
              index === current
                ? "bg-[var(--color-primary-base)] scale-110"
                : "bg-[var(--color-primary-disabled)] hover:bg-[var(--color-primary-base)]/50"
            }`}
            aria-label={`الانتقال إلى الصورة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
