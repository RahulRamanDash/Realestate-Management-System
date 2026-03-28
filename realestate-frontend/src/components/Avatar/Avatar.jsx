import { getInitials } from '../../shared/utils/helpers';
import { cn } from '../../shared/utils/helpers';

/**
 * Avatar Component
 * Displays user image or initials
 */
const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
  fallbackBg = 'bg-emerald-500',
}) => {
  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full flex-shrink-0 font-semibold overflow-hidden',
        sizeStyles[size],
        !src && cn(fallbackBg, 'text-white'),
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name || alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
