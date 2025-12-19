import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
    label,
    icon,
    children,
    className = "",
    ...props
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-textPrimary mb-1 flex items-center gap-2">
                    {icon && <span>{icon}</span>}
                    {label}
                </label>
            )}
            <select
                className={`w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors ${className}`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

export default Select;
