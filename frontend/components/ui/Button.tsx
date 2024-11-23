// components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  children, 
  onClick,
  className = ''
}: ButtonProps) {
  const baseStyles = "bg-red-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105";

  return (
    <button 
      className={`${baseStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}