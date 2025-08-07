import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mx-auto bg-[var(--color-bg-card)] rounded-lg text-center relative border-1 border-[var(--color-bg-divider)] ">
      <div className="overflow-hidden rounded-lg h-64 sm:h-72 md:h-80 lg:h-100 relative">
        <img
          src={slides[current].image}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-cover"
        />
        <h2 className="absolute bottom-4 right-0 left-0 text-lg sm:text-xl md:text-2xl font-semibold bg-[var(--color-secondary-base)]/70 backdrop-blur-sm text-[var(--color-bg-muted-text)] px-4 py-3">
          {slides[current].title}
        </h2>
      </div>

      {/* Dots */}
      {/* <div className="absolute bottom-2 right-0 left-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current
                ? "bg-[var(--color-primary-base)]"
                : "bg-[var(--color-secondary-disabled)]"
            }`}></button>
        ))}
      </div> */}
    </div>
  );
};

export default Carousel;
