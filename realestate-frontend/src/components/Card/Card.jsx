import { cn } from '../../shared/utils/helpers';
import { CARD_VARIANTS } from '../../shared/utils/constants';

/**
 * Generic Card Component
 */
export const Card = ({
  variant = CARD_VARIANTS.GLASS,
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    [CARD_VARIANTS.GLASS]: 'glass-panel',
    [CARD_VARIANTS.ELEVATED]: 'border border-white/10 bg-white/5 shadow-lg',
    [CARD_VARIANTS.FLAT]: 'bg-white/5 border-0',
    [CARD_VARIANTS.BORDERED]: 'border border-white/15 bg-transparent',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Empty State Component
 * Shows when no data is available
 */
export const EmptyState = ({
  icon: Icon,
  title = 'No data available',
  description = '',
  action,
}) => {
  return (
    <div className="glass-panel rounded-2xl px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex justify-center">
          <Icon className="h-12 w-12 text-slate-400" />
        </div>
      )}
      <h3 className="page-heading mb-2 text-xl font-semibold">{title}</h3>
      {description && <p className="page-copy mb-6 text-sm">{description}</p>}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

/**
 * Error State Component
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
}) => {
  return (
    <div className="status-error rounded-2xl px-6 py-12 text-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 text-sm opacity-90">{message}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default Card;
