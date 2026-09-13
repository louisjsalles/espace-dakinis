"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // fixed bottom-6 right-6 le fait flotter sans prendre d'espace dans la page
  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      {isVisible && (
        <button 
          onClick={scrollToTop} 
          className="pointer-events-auto p-2 transition-transform hover:scale-110"
          aria-label="Remonter en haut"
        >
          <img 
            src="/drigug.png" 
            alt="Remonter en haut" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
          />
        </button>
      )}
    </div>
  );
}