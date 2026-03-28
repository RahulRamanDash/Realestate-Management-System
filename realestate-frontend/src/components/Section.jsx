import { cn } from '../shared/utils/helpers';

/**
 * Section Component
 * Wrapper for consistent page sections with padding and container
 */
const Section = ({
  variant = 'default',
  maxWidth = '7xl',
  children,
  className,
  py = 16,
  px = 4,
  ...props
}) => {
  const variantStyles = {
    default: 'section-shell',
    full: '',
  };

  const paddingClass = `px-${px} py-${py}`;

  return (
    <section
      className={cn(variantStyles[variant], paddingClass, className)}
      {...props}
    >
      <div className={cn(`mx-auto max-w-${maxWidth}`)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
