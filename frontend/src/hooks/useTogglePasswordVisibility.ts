import { useState } from "react";

export function useTogglePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    setIsVisible((prev) => !prev);
  }

  return {
    isVisible,
    toggleVisibility,
    inputType: isVisible ? "text" : "password",
  };
}
