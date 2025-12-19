import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, icon, className = "", ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-textPrimary mb-1 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </label>
      )}
      <input
        className={`w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
