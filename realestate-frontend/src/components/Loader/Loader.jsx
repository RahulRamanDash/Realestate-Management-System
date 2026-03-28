import { cn } from '../../shared/utils/helpers';

/**
 * Spinner Component
 * Shows loading state
 */
export const Spinner = ({ size = 'md', className }) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <svg
      className={cn('animate-spin', sizeStyles[size], className)}
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
  );
};

/**
 * Skeleton Loader Component
 * Shows placeholder while loading
 */
export const SkeletonLoader = ({
  count = 1,
  height = 'h-6',
  width = 'w-full',
  rounded = 'rounded',
  className,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            height,
            width,
            rounded,
            'animate-pulse bg-gradient-to-r from-white/10 to-white/5',
            className
          )}
        />
      ))}
    </>
  );
};

/**
 * PropertyCard Skeleton Loader
 */
export const PropertyCardSkeleton = () => {
  return (
    <div className="market-card animate-pulse">
      <div className="h-56 bg-gradient-to-r from-white/10 to-white/5" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-gradient-to-r from-white/10 to-white/5" />
        <div className="h-4 w-1/2 rounded bg-gradient-to-r from-white/10 to-white/5" />
        <div className="space-y-2">
          <div className="h-4 rounded bg-gradient-to-r from-white/10 to-white/5" />
          <div className="h-4 w-5/6 rounded bg-gradient-to-r from-white/10 to-white/5" />
        </div>
      </div>
    </div>
  );
};

/**
 * Page Loader - Full page loading state
 */
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4 text-emerald-400" />
        <p className="page-copy text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Spinner;
