import { cn } from '../../shared/utils/helpers';
import { BADGE_VARIANTS } from '../../shared/utils/constants';

/**
 * Badge Component
 * Used for tags, status, and labels
 */
const Badge = ({
  variant = BADGE_VARIANTS.NEUTRAL,
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold';

  const variantStyles = {
    [BADGE_VARIANTS.SUCCESS]: 'status-success',
    [BADGE_VARIANTS.ERROR]: 'status-error',
    [BADGE_VARIANTS.WARNING]: 'status-warning',
    [BADGE_VARIANTS.INFO]: 'bg-blue-400/15 border border-blue-400/30 text-blue-200',
    [BADGE_VARIANTS.NEUTRAL]: 'status-neutral',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
