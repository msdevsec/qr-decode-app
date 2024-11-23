'use client';
// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick,
  className = '',
  disabled = false
}: ButtonProps) {
  const baseStyles = "bg-red-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button 
      className={`${baseStyles} ${className} ${disabledStyles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
