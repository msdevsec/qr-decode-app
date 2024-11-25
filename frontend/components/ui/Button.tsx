'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  onClick,
  className = '',
  disabled = false,
  isLoading = false,
  size = 'md',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-12 py-4 text-lg'
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
  };

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    active:scale-95
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02]'}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
  `;

  return (
    <button 
      className={`${baseStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
