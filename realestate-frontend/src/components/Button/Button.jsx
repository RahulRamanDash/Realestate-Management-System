import { cn } from '../../shared/utils/helpers';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../shared/utils/constants';

/**
 * Button Component
 * Supports primary, secondary, danger, ghost variants with multiple sizes
 */
const Button = ({
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MD,
  disabled = false,
  loading = false,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    [BUTTON_VARIANTS.PRIMARY]:
      'primary-button',
    [BUTTON_VARIANTS.SECONDARY]:
      'secondary-button',
    [BUTTON_VARIANTS.DANGER]:
      'danger-button',
    [BUTTON_VARIANTS.GHOST]:
      'border-0 bg-transparent text-current hover:bg-white/5 active:bg-white/10',
  };

  const sizeStyles = {
    [BUTTON_SIZES.SM]: 'px-4 py-2 text-sm',
    [BUTTON_SIZES.MD]: 'px-5 py-2.5 text-sm',
    [BUTTON_SIZES.LG]: 'px-6 py-3 text-base',
  };

  const finalClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
      )}
      {children}
    </button>
  );
};

export default Button;
