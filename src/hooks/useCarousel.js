// src/hooks/useCarousel.js
import { useState, useEffect, useCallback } from "react";

export const useCarousel = (slides, interval = 3000) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      setCurrent((prev) => {
        if (index < 0) return slides.length - 1;
        if (index >= slides.length) return 0;
        return index;
      });
    },
    [slides.length]
  );

  const goToPrevious = useCallback(() => {
    goToSlide(current - 1);
  }, [current, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(current + 1);
  }, [current, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval, isPaused]);

  return {
    current,
    setIsPaused,
    goToSlide,
    goToPrevious,
    goToNext,
  };
};
