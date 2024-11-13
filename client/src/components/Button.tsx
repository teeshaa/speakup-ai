"use client";

import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  isRecording?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, isRecording }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-lg text-white transition-colors ${
        isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
