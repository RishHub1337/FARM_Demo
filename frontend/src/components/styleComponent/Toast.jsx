import React, { useRef, useEffect, useState } from "react";

const Toast = ({ text, mode, onClose, duration = 3000 }) => {
  const toastRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger exit animation before duration ends
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before calling onClose
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (mode === "checkbox") {
    return (
      <div
        ref={toastRef}
        className={`transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        <div
          className="w-sm bg-teal-500 text-sm text-white rounded-none shadow-lg"
          role="alert"
          tabIndex={-1}
        >
          <div className="flex justify-center items-center !px-2 !py-4">
            <div className="flex gap-4">
              <span>{text}</span>
              <div className="ms-auto">
                <button
                  type="button"
                  className="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-white hover:text-white opacity-50 hover:opacity-100"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (mode === "cross") {
    return (
      <div
        ref={toastRef}
        className={`transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        <div
          className="flex items-center w-full max-w-sm p-4 text-gray-700 bg-white rounded-lg shadow border border-gray-200"
          role="alert"
        >
          <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-red-500 bg-red-100 rounded">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
            <span className="sr-only">Error icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">{text}</div>
          <button
            type="button"
            className="ms-auto flex items-center justify-center text-gray-700 hover:text-gray-900 bg-transparent border border-transparent hover:bg-gray-100 rounded text-sm h-8 w-8"
            aria-label="Close"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Toast;
