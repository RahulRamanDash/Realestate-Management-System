import { forwardRef } from 'react';
import { cn } from '../../shared/utils/helpers';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * FormField Wrapper Component
 * Provides consistent label, error, and helper text styling
 */
export const FormField = ({
  label,
  error,
  hint,
  required = false,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="page-copy block text-sm font-semibold">
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}
      {hint && !error && (
        <p className="page-copy text-xs">{hint}</p>
      )}
    </div>
  );
};

/**
 * Input Component
 */
export const Input = forwardRef(
  (
    {
      type = 'text',
      error = false,
      success = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={cn(
            'field-base w-full px-4 py-3 text-sm transition-all duration-200',
            error && 'border-red-400/50 focus:border-red-400/70 bg-red-400/5',
            success && 'border-emerald-400/50 focus:border-emerald-400/70',
            className
          )}
          {...props}
        />
        {success && (
          <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-400" />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea Component
 */
export const Textarea = forwardRef(
  (
    {
      error = false,
      success = false,
      className,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'field-base w-full px-4 py-3 resize-none text-sm transition-all duration-200',
          error && 'border-red-400/50 focus:border-red-400/70 bg-red-400/5',
          success && 'border-emerald-400/50 focus:border-emerald-400/70',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Select Component
 */
export const Select = forwardRef(
  (
    {
      error = false,
      success = false,
      options = [],
      placeholder = 'Select an option',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <select
        ref={ref}
        className={cn(
          'field-base w-full px-4 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer',
          error && 'border-red-400/50 focus:border-red-400/70 bg-red-400/5',
          success && 'border-emerald-400/50 focus:border-emerald-400/70',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

/**
 * Checkbox Component
 */
export const Checkbox = forwardRef(
  ({ label, error = false, className, ...props }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'h-5 w-5 rounded border border-white/20 bg-white/5 text-emerald-500 focus:ring-2 focus:ring-emerald-400/50 cursor-pointer',
            error && 'border-red-400/50',
            className
          )}
          {...props}
        />
        {label && (
          <label className="page-copy cursor-pointer text-sm">{label}</label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * Radio Component
 */
export const Radio = forwardRef(
  ({ label, error = false, className, ...props }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="radio"
          className={cn(
            'h-5 w-5 border border-white/20 bg-white/5 text-emerald-500 focus:ring-2 focus:ring-emerald-400/50 cursor-pointer',
            error && 'border-red-400/50',
            className
          )}
          {...props}
        />
        {label && (
          <label className="page-copy cursor-pointer text-sm">{label}</label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
