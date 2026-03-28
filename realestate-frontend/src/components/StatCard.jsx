import AnimatedCounter from './AnimatedCounter';
import { cn } from '../shared/utils/helpers';

/**
 * StatCard - Displays stat with icon, label, and optional animation
 * Shows metrics with consistent styling and hover effects
 */
const StatCard = ({
  icon,
  label,
  value,
  animated = true,
  suffix = '',
  description,
  gradient = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-panel rounded-2xl p-6 transition-all duration-300',
        'hover:shadow-lg hover:bg-white/8 hover:border-emerald-400/30',
        onClick && 'cursor-pointer',
        gradient && 'bg-gradient-to-br from-emerald-400/10 to-transparent',
        className
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
          {icon}
        </div>
      )}

      {animated ? (
        <div className="headline-font page-heading text-3xl font-bold">
          <AnimatedCounter
            end={typeof value === 'number' ? value : parseInt(value)}
            duration={1.5}
            suffix={suffix}
          />
        </div>
      ) : (
        <p className="headline-font page-heading text-3xl font-bold">
          {value}
          {suffix}
        </p>
      )}

      <p className="page-copy mt-2 text-sm text-emerald-100/70">{label}</p>

      {description && (
        <p className="page-copy mt-3 text-xs leading-relaxed text-emerald-100/50">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;
